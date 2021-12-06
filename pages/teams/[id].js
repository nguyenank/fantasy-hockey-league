import Layout from "../../components/Layout";
import StatBlocks from "../../components/StatBlocks";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
    doc,
    getDoc,
    orderBy,
    where,
} from "firebase/firestore";
import SkaterTable from "../../components/SkaterTable";
import GoalieTable from "../../components/GoalieTable";
import BackToTop from "../../components/BackToTop";
import _ from "lodash";
import styles from "./team.module.scss";

export default function Team({ team, skaters, goalies }) {
    return (
        <Layout pageHeader={team ? team.teamName : "Team Not Found"}>
            {team ? (
                <>
                    <StatBlocks
                        stats={[
                            {
                                text: `Rank: ${team.rankings.overall}/58`,
                                href: "/team-leaderboard",
                            },
                            { text: `Points: ${team.points.toFixed(2)}` },
                        ]}
                    />
                    <SkaterTable players={skaters} team={true} />
                    <div className={styles.divider}></div>
                    <GoalieTable players={goalies} team={true} />
                    <BackToTop />
                </>
            ) : (
                <div>
                    We could not find a team linked with this account for this
                    PHF 2021-2022 league.
                </div>
            )}
        </Layout>
    );
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const db = getFirestore();
    let teams = [];

    const teamQuery =
        process.env.DATA_FULL === "true"
            ? query(
                  collection(db, "leagues/phf2122/teams"),
                  orderBy("points", "desc")
              )
            : query(
                  collection(db, "leagues/phf2122/teams"),
                  orderBy("points", "desc"),
                  limit(25)
              );

    const teamQuerySnapshot = await getDocs(teamQuery);
    teamQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        teams.push({ params: { id: doc.data().userId } });
    });

    return { paths: teams, fallback: true };
}
export async function getStaticProps({ params }) {
    const db = getFirestore();
    const docRef = doc(db, "leagues/phf2122/teams", params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return { props: {} };
    }

    const data = docSnap.data();
    let skaters = [];
    // need to split up skaters because can do max 10 at a time
    for (const players of [data.players.slice(0, 6), data.players.slice(6)]) {
        const playerQuery = query(
            collection(db, "leagues/phf2122/players"),
            where("playerId", "in", players),
            orderBy("points", "desc")
        );

        const playerQuerySnapshot = await getDocs(playerQuery);
        playerQuerySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const data = doc.data();
            skaters.push(data);
        });
    }

    const np_skaters = _.remove(skaters, "not_playing");
    let goalies = _.remove(skaters, (s) => s.position === "G");
    const np_goalies = _.remove(goalies, "not_playing");

    skaters = _.map(_.orderBy(skaters, ["points"], "desc"), (player) => ({
        ...player,
        ...player.stats,
        points: player.points.toFixed(2),
        ppg: player.ppg.toFixed(2),
    }));

    goalies = _.map(_.orderBy(goalies, ["points"], "desc"), (player) => ({
        ...player,
        ...player.stats,
        points: player.points.toFixed(2),
        ppg: player.ppg.toFixed(2),
    }));

    return {
        props: {
            skaters: [...skaters, ...np_skaters],
            goalies: [...goalies, ...np_goalies],
            team: data,
        },
    };
}
