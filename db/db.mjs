import dotenv from "dotenv/config.js";
import fs from "fs";
import papa from "papaparse";
import _ from "lodash";
import { default as Firestore } from "@google-cloud/firestore";
import { v4 as uuidv4 } from "uuid";
import { getAnalytics, isSupported } from "firebase/analytics";

// Initialize Firebase

const firestore = new Firestore({
    projectId: process.env.FIREBASE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

function playerDB(file_path) {
    //  pull information from spreadsheet about players
    const file = fs.createReadStream(file_path);
    const players = [];
    return new Promise((resolve) => {
        papa.parse(file, {
            header: true,
            dynamicTyping: true,
            transformHeader: _.snakeCase,
            skipEmptyLines: true,
            transform: (v, h) =>
                // replace all null scoring rates with
                ["phf", "ncaa", "ncaa_diii", "sdhl"].includes(h) &&
                (v === "" || v === "GOALIE")
                    ? 0
                    : v,
            complete: (results) => {
                function transformData(result) {
                    const playerId = uuidv4();
                    const data = {
                        playerId: playerId,
                        name: result.player,
                        position: result.p,
                        ..._.pick(result, ["team", "age", "fantasy_value"]),
                        league_scoring_rates: _.pick(result, [
                            "phf",
                            "ncaa",
                            "usports",
                            "ncaa_diii",
                            "sdhl",
                        ]),
                        stats:
                            result.p === "G"
                                ? {
                                      gp: 0,
                                      start: 0,
                                      w: 0,
                                      svs: 0,
                                      ga: 0,
                                      so: 0,
                                      a1: 0,
                                      a2: 0,
                                      ps_sv: 0,
                                  }
                                : {
                                      gp: 0,
                                      sog: 0,
                                      g: 0,
                                      a1: 0,
                                      a2: 0,
                                      pim: 0,
                                      pend: 0,
                                      bks: 0,
                                      hattys: 0,
                                  },
                    };
                    players.push(data);
                }
                _.map(results.data, transformData);
                resolve(players);
            },
        });
    });
}

function playerStats(file_path) {
    //  pull information from spreadsheet about player stats
    const file = fs.createReadStream(file_path);
    return new Promise((resolve) => {
        papa.parse(file, {
            header: true,
            transform: (v, h) =>
                // replace all null values with 0
                v === "" ? 0 : v,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                async function transformData(result) {
                    const q = firestore
                        .collection("leagues/phf2122/players")
                        .where("name", "==", result.name);
                    const querySnapshot = await q.get();
                    if (querySnapshot.size !== 1) {
                        throw `not enough/too many players with same name: ${result.name}`;
                    }
                    let playerId;
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        playerId = doc.id;
                    });
                    return { ...result, playerId: playerId };
                }
                resolve(Promise.all(_.map(results.data, transformData)));
            },
        });
    });
}

async function initializePlayers(
    file_path = "./db/spreadsheets/phf_21-22.csv"
) {
    const batch = firestore.writeBatch();
    const players = await playerDB(file_path);
    _.forEach(players, (player) => {
        batch.set(
            firestore.doc(`leagues/phf2122/players/${player.playerId}`),
            player
        );
    });
    await batch.commit();
    console.log("Players initialized!");
}

// // update skater stats
async function updateSkaterStats(
    skater_file = "./db/spreadsheets/skater_stats-11-23-21.csv",
    goalie_file = "./db/spreadsheets/goalie_stats-11-23-21.csv"
) {
    const batch = firestore.batch();
    const skaters = await playerStats(skater_file);
    _.forEach(skaters, (s) => {
        const points =
            0.1 * s.sog +
            s.g +
            0.9 * s.a1 +
            0.66 * s.a2 -
            0.12 * s.pim +
            0.12 * s.pend +
            0.12 * s.bks +
            s.hattys;
        const ppg = s.gp ? points / s.gp : 0;
        batch.update(firestore.doc(`leagues/phf2122/players/${s.playerId}`), {
            stats: _.omit(s, ["name", "playerId"]),
            points: points,
            ppg: ppg,
        });
    });

    const goalies = await playerStats(goalie_file);
    _.forEach(goalies, (g) => {
        const points =
            0.25 * g.start +
            0.75 * g.w +
            0.13 * g.svs -
            g.ga +
            2 * g.so +
            0.9 * g.a1 +
            0.66 * g.a2 +
            g.ps_sv;
        const ppg = g.gp ? points / g.gp : 0;
        batch.update(firestore.doc(`leagues/phf2122/players/${g.playerId}`), {
            stats: _.omit(g, ["name", "playerId"]),
            points: points,
            ppg: ppg,
        });
    });

    await batch.commit();
    console.log("Players updated!");
}
// // add teams from JSON file
async function addTeams(teams_json) {
    const data = JSON.parse(fs.readFileSync(teams_json));
    const batch = firestore.batch();
    const teams = await generateTeams(data);
    _.forEach(teams, (team) => {
        const userId = uuidv4();
        batch.set(firestore.doc(`leagues/phf2122/teams/${userId}`), {
            userId: userId,
            teamName: team.teamName,
            players: _.map(team.players, "playerId"),
            changes: 0,
            points: _.sum(_.map(team.players, "points")),
        });
    });
    await batch.commit();
    console.log("Teams added!");
}
async function generateTeams(teams, byName = false) {
    async function generateTeam(t) {
        let players;
        if (byName) {
            players = await getPlayerInfoByName(t.players);
        } else {
            players = await getPlayerInfoById(t.players);
        }
        return {
            teamName: t.teamName,
            userId: t.userId ? t.userId : undefined,
            players: players,
        };
    }

    return new Promise((resolve) => {
        resolve(Promise.all(teams.map((t) => generateTeam(t))));
    });
}

async function getPlayerInfoByName(team) {
    async function findPlayerId(player) {
        const q = firestore
            .collection("leagues/phf2122/players")
            .where("name", "==", player);
        const querySnapshot = await q.get();
        if (querySnapshot.size !== 1) {
            throw `not enough/too many players with same name: ${player}, ${querySnapshot.size} players found`;
        }
        let playerId;
        let points;
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            playerId = doc.id;
            points = doc.data().points;
        });
        return { player, playerId, points };
    }

    return new Promise((resolve) => {
        resolve(Promise.all(team.map((p) => findPlayerId(p))));
    });
}

async function getPlayerInfoById(team) {
    async function findPlayer(player) {
        const q = firestore.doc(`leagues/phf2122/players/${player}`);
        const doc = await q.get();
        return doc.data();
    }

    return new Promise((resolve) => {
        resolve(Promise.all(team.map((p) => findPlayer(p))));
    });
}

// // update ranks and points
async function updatePlayerRankings() {
    // get teams
    const q = firestore
        .collection("leagues/phf2122/players")
        .orderBy("points", "desc");
    const querySnapshot = await q.get();
    let skaters = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        skaters.push(doc.data());
    });
    // skaters = _.filter(skaters, (s) => !s.not_playing);
    // calculate rankings for position and overall
    let goalies = _.remove(skaters, (p) => p.position === "G");
    skaters = _.map(skaters, (s, i) => ({ ...s, rankings: { skater: i + 1 } }));
    goalies = _.map(goalies, (g, i) => ({ ...g, rankings: { goalie: i + 1 } }));
    let players = _.orderBy(_.concat(skaters, goalies), ["points"], ["desc"]);
    players = _.map(players, (p, i) => ({
        ...p,
        rankings: { ...p.rankings, overall: i + 1 },
    }));
    // push back to firestore
    const batch = firestore.batch();
    _.forEach(players, (p) => {
        batch.update(firestore.doc(`leagues/phf2122/players/${p.playerId}`), {
            rankings: p.rankings,
        });
    });
    await batch.commit();
    console.log("Player Rankings Updated!");
}

async function updateTeamPointsAndRankings() {
    // get teams
    const q = firestore
        .collection("leagues/phf2122/teams")
        .where("submitted", "==", true);
    const querySnapshot = await q.get();
    let data = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push(doc.data());
    });
    // get players for each team
    let teams = await generateTeams(data);
    // calculate points
    teams = _.map(teams, (t) => ({
        ...t,
        points: _.sum(_.map(t.players, "points")),
    }));
    // calculate rankings
    teams = _.orderBy(teams, ["points"], "desc");
    teams = _.map(teams, (t, i) => ({ ...t, rankings: { overall: i + 1 } }));

    // push back to firestore
    const batch = firestore.batch();
    _.forEach(teams, (t) => {
        batch.update(firestore.doc(`leagues/phf2122/teams/${t.userId}`), {
            points: t.points,
            rankings: t.rankings,
        });
    });
    await batch.commit();
    console.log("Team Points & Rankings Updated!");
}

// initializePlayers();
// addTeams("./db/data/phf_teams.json");

await updateSkaterStats(
    "./db/data/skater_stats-final.csv",
    "./db/data/goalie_stats-final.csv"
);
await updatePlayerRankings();
await updateTeamPointsAndRankings();
