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

// export async function getStaticProps() {
//     // Call an external API endpoint to get posts
//     const db = getFirestore();
//     let teams = [];
//     let players = [];
//
//     const teamQuery = query(
//         collection(db, "leagues/phf2122/teams"),
//         orderBy("points", "desc"),
//         limit(10)
//     );
//     const playerQuery = query(
//         collection(db, "leagues/phf2122/players"),
//         orderBy("points", "desc"),
//         limit(10)
//     );
//
//     const teamQuerySnapshot = await getDocs(teamQuery);
//     teamQuerySnapshot.forEach(doc => {
//         // doc.data() is never undefined for query doc snapshots
//         teams.push(doc.data());
//     });
//
//     const playerQuerySnapshot = await getDocs(playerQuery);
//     playerQuerySnapshot.forEach(doc => doc.data());
//
//     teams = _.map(teams, (team, index) => ({ ...team, index: index + 1 }));
//     players = _.map(players, (player, index) => ({
//         ...player,
//         points: player.points.toFixed(2),
//         index: index + 1,
//     }));
//     return {
//         props: {
//             teams,
//             players,
//         },
//     };
// }

export default function Demo({ teams, players }) {
    const testTeams = [
        { teamName: "My First Team", points: 42, index: 1 },
        { teamName: "My Second Team", points: 35, index: 2 },
    ];

    const testPlayers = [
        {
            name: "Amanda Leveille",
            team: "MIN",
            points: 12.99,
            index: 1,
            playerId: "1232",
        },
        {
            name: "Katie Burt",
            team: "BOS",
            points: 11.43,
            index: 2,
            playerId: "132",
        },
        {
            name: "Elaine Chuli",
            team: "TOR",
            points: 5.84,
            index: 3,
            playerId: "133",
        },
    ];
    return (
        <Layout pageHeader={""}>
            <div className={styles.columns}>
                <div className={styles.tableArea}>
                    <h4>Top 10 Teams</h4>
                    <TeamTable teams={testTeams} />
                    <Link href="/team-leaderboard">
                        <a className={styles.links}>View Team Leaderboard</a>
                    </Link>
                </div>
                <div className={styles.tableArea}>
                    <h4>Top 10 Players</h4>
                    <PlayerTable players={testPlayers} />
                    <Link href="/player-leaderboard">
                        <a className={styles.links}>View Player Leaderboard</a>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
