import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import TeamTable from "../components/TeamTable";
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
    let teams = [];

    const teamQuery =
        process.env.DATA_FULL === "true"
            ? query(
                  collection(db, "leagues/phf2122/teams"),
                  where("submitted", "==", true),
                  orderBy("rankings.overall", "asc")
              )
            : query(
                  collection(db, "leagues/phf2122/teams"),
                  where("submitted", "==", true),
                  orderBy("rankings.overall", "asc"),
                  limit(25)
              );

    const teamQuerySnapshot = await getDocs(teamQuery);
    teamQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        teams.push(doc.data());
    });

    teams = _.map(teams, (team, index) => ({ ...team, index: index + 1 }));

    return {
        props: {
            teams,
        },
    };
}

export default function Demo({ teams }) {
    return (
        <Layout pageHeader={"Team Leaderboard"}>
            <div className="center">
                <TeamTable teams={teams} />
            </div>
            <BackToTop />
        </Layout>
    );
}
