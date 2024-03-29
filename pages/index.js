import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import TeamTable from "../components/TeamTable";
import PlayerTable from "../components/PlayerTable";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    where,
} from "firebase/firestore";
import styles from "./styles/index.module.scss";
import _ from "lodash";

export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const db = getFirestore();
    let teams = [];
    let players = [];

    const teamQuery = query(
        collection(db, "leagues/phf2122/teams"),
        where("submitted", "==", true),
        orderBy("rankings.overall", "asc"),
        limit(10)
    );
    const playerQuery = query(
        collection(db, "leagues/phf2122/players"),
        orderBy("rankings.overall", "asc"),
        limit(10)
    );

    const teamQuerySnapshot = await getDocs(teamQuery);
    teamQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        teams.push(doc.data());
    });

    const playerQuerySnapshot = await getDocs(playerQuery);
    playerQuerySnapshot.forEach((doc) => {
        players.push(doc.data());
    });

    players = _.map(players, (player) => ({
        ...player,
        gp: player.stats.gp,
        points: player.points.toFixed(2),
        ppg: player.ppg.toFixed(2),
    }));

    return {
        props: {
            teams,
            players,
        },
    };
}

export default function Index({ teams, players }) {
    return (
        <Layout pageHeader={""}>
            <div className={styles.columns}>
                <div className={styles.tableArea}>
                    <h4>Top 10 Teams</h4>
                    <TeamTable teams={teams} />
                    <div className={styles.links}>
                        <Link href="/team-leaderboard">
                            <a>View Team Leaderboard</a>
                        </Link>
                    </div>
                </div>
                <div className={styles.tableArea}>
                    <h4>Top 10 Players</h4>
                    <PlayerTable players={players} index={true} />
                    <div className={styles.links}>
                        <Link href="/player-leaderboard">
                            <a>View Player Leaderboard</a>
                        </Link>
                        {" | "}
                        <Link href="/skater-leaderboard">
                            <a>View Skater Leaderboard</a>
                        </Link>
                        {" | "}
                        <Link href="/goalie-leaderboard">
                            <a>View Goalie Leaderboard</a>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
