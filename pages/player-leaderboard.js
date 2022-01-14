import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import PlayerTable from "../components/PlayerTable";
import BackToTop from "../components/BackToTop";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
    orderBy,
} from "firebase/firestore";
import { default as _ } from "lodash";
import styles from "./styles/index.module.scss";

export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const db = getFirestore();
    let players = [];
    const playerQuery =
        process.env.DATA_FULL === "true"
            ? query(
                  collection(db, "leagues/phf2122/players"),
                  orderBy("rankings.overall", "asc")
              )
            : query(
                  collection(db, "leagues/phf2122/players"),
                  orderBy("rankings.overall", "asc"),
                  limit(25)
              );

    const playerQuerySnapshot = await getDocs(playerQuery);
    playerQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        players.push(doc.data());
    });

    players = _.map(players, (player, index) => ({
        ...player,
        gp: player.stats.gp,
        index: index + 1,
        points: player.points.toFixed(2),
        ppg: player.ppg.toFixed(2),
    }));
    return {
        props: {
            players,
        },
    };
}

export default function Demo({ players, np_players }) {
    return (
        <Layout pageHeader={"Player Leaderboard"}>
            <div className="center">
                <PlayerTable players={players} />
            </div>
            <BackToTop />
        </Layout>
    );
}
