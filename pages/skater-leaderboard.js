import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import SkaterTable from "../components/SkaterTable";
import BackToTop from "../components/BackToTop";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    where,
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
                  where("position", "in", ["F", "D", "F/D", "D/F"]),
                  orderBy("rankings.skater", "asc")
              )
            : query(
                  collection(db, "leagues/phf2122/players"),
                  where("position", "in", ["F", "D", "F/D", "D/F"]),
                  orderBy("rankings.skater", "asc"),
                  limit(25)
              );

    const playerQuerySnapshot = await getDocs(playerQuery);
    playerQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        players.push(doc.data());
    });

    const np_players = _.remove(players, "not_playing");

    players = _.map(players, (player, index) => ({
        ...player,
        ...player.stats,
        index: index + 1,
        points: player.points.toFixed(2),
        ppg: player.ppg.toFixed(2),
    }));
    return {
        props: {
            players,
            np_players,
        },
    };
}

export default function Demo({ players, np_players }) {
    return (
        <Layout pageHeader={"Skater Leaderboard"}>
            <div className="center">
                <SkaterTable players={[...players, ...np_players]} />
            </div>
            <BackToTop />
        </Layout>
    );
}
