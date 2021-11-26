import dotenv from "dotenv/config.js";
import fs from "fs";
import papa from "papaparse";
import _ from "lodash";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    writeBatch,
    doc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported()
    .then(result => {
        if (result) getAnalytics(app);
    })
    .catch(e => console.log("error initializing analytics"));

const db = getFirestore();

function playerDB(file_path) {
    //  pull information from spreadsheet about players
    const file = fs.createReadStream(file_path);
    const players = [];
    return new Promise(resolve => {
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
            complete: results => {
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
    return new Promise(resolve => {
        papa.parse(file, {
            header: true,
            transform: (v, h) =>
                // replace all null values with 0
                v === "" ? 0 : v,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: results => {
                async function transformData(result) {
                    const q = query(
                        collection(db, "leagues/phf2122/players"),
                        where("name", "==", result.name)
                    );
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.size !== 1) {
                        throw `not enough/too many players with same name: ${result.name}`;
                    }
                    let playerId;
                    querySnapshot.forEach(doc => {
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
    const batch = writeBatch(db);
    const players = await playerDB(file_path);
    _.forEach(players, player => {
        batch.set(
            doc(db, `leagues/phf2122/players/${player.playerId}`),
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
    const batch = writeBatch(db);
    const skaters = await playerStats(skater_file);
    _.forEach(skaters, s => {
        const points =
            0.1 * s.sog +
            s.g +
            0.9 * s.a1 +
            0.66 * s.a2 -
            0.12 * s.pim +
            0.12 * s.pend +
            0.12 * s.bks +
            s.hattys;
        batch.update(doc(db, `leagues/phf2122/players/${s.playerId}`), {
            stats: _.omit(s, ["name", "playerId"]),
            points: points,
        });
    });

    const goalies = await playerStats(goalie_file);
    _.forEach(goalies, g => {
        const points =
            0.25 * g.start +
            0.75 * g.w +
            0.13 * g.svs -
            g.ga +
            2 * g.so +
            0.9 * g.a1 +
            0.66 * g.a2 +
            g.ps_sv;
        batch.update(doc(db, `leagues/phf2122/players/${g.playerId}`), {
            stats: _.omit(g, ["name", "playerId"]),
            points: points,
        });
    });

    await batch.commit();
    console.log("Players updated!");
}

// initializePlayers();
updateSkaterStats();
