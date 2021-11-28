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
        orderBy("points", "desc"),
        limit(10)
    );
    const playerQuery = query(
        collection(db, "leagues/phf2122/players"),
        orderBy("points", "desc"),
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

    teams = _.map(teams, (team, index) => ({ ...team, index: index + 1 }));
    players = _.map(players, (player, index) => ({
        ...player,
        points: player.points.toFixed(2),
        index: index + 1,
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
                    <Link href="/team-leaderboard">
                        <a className={styles.links}>View Team Leaderboard</a>
                    </Link>
                </div>
                <div className={styles.tableArea}>
                    <h4>Top 10 Players</h4>
                    <PlayerTable players={players} />
                    <div>
                        <Link href="/player-leaderboard">
                            <a className={styles.links}>
                                View Player Leaderboard
                            </a>
                        </Link>
                        {" | "}
                        <Link href="/skater-leaderboard">
                            <a className={styles.links}>
                                View Skater Leaderboard
                            </a>
                        </Link>
                        {" | "}
                        <Link href="/goalie-leaderboard">
                            <a className={styles.links}>
                                View Goalie Leaderboard
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
