import Link from "next/link";
import Layout from "../../components/Layout";
import InfoBlocks from "../../components/InfoBlocks";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
    doc,
    getDoc,
    setDoc,
    orderBy,
    where,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SkaterTable from "../../components/SkaterTable";
import GoalieTable from "../../components/GoalieTable";
import BackToTop from "../../components/BackToTop";
import _ from "lodash";
import styles from "./team.module.scss";

async function createTeam(uid) {
    const db = getFirestore();
    const docRef = doc(db, "leagues/phf2122/teams", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // do not regenerate team if already exists
        return;
    } else {
        await setDoc(docRef, {
            userId: uid,
            teamName: "Unnamed Team",
            submitted: false,
            players: [],
            changes: 0,
            points: 0,
            rankings: {
                overall: 1,
            },
        });
    }
}

export default function Team({ team, skaters, goalies, userId }) {
    const router = useRouter();
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    const [waiting, setWaiting] = useState(false);

    if (!team && user && userId === user.uid) {
        return (
            <Layout pageHeader={"No Team"}>
                <div>
                    You have not submitted a team for the PHF 2021-2022 league.
                </div>
                <button
                    className={styles.btn}
                    onClick={async () => {
                        setWaiting(true);
                        createTeam(user.uid);
                        router.push("/modify-team");
                    }}
                >
                    {waiting ? "..." : "Create Team"}
                </button>
            </Layout>
        );
    }

    if (!team || (!team.submitted && user && user.uid !== team.userId)) {
        return (
            <Layout pageHeader={"Team Not Found"}>
                <div>
                    We could not find this team for the PHF 2021-2022 league.
                </div>
            </Layout>
        );
    }

    let changesModify = [];
    if (team.submitted) {
        changesModify = [
            ...changesModify,
            {
                bold: "Changes: ",
                text: `${team.changes}/3`,
            },
        ];
    }
    if (user && user.uid === team.userId) {
        changesModify = [
            ...changesModify,
            {
                bold: `Modify Team`,
                href: "/modify-team",
            },
        ];
    }

    return (
        <Layout
            pageHeader={`${team.submitted ? "" : "[UNSUBMITTED] "}${
                team.teamName
            }`}
        >
            <>
                <div className={styles.columns}>
                    <InfoBlocks
                        info={[
                            {
                                bold: "Rank:",
                                text: ` ${team.rankings.overall}/58`,
                                href: "/team-leaderboard",
                            },
                            {
                                bold: "Points: ",
                                text: `${team.points.toFixed(2)}`,
                            },
                        ]}
                    />
                    <InfoBlocks info={changesModify} />
                </div>
                <SkaterTable players={skaters} team={true} />
                <div className={styles.divider}></div>
                <GoalieTable players={goalies} team={true} />
                <BackToTop />
            </>
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
        return {
            props: { userId: params.id },
            revalidate: 20,
        };
    }

    const data = docSnap.data();

    let skaters = [];
    // need to split up skaters because can do max 10 at a time
    for (const players of [data.players.slice(0, 6), data.players.slice(6)]) {
        if (players.length > 0) {
            const playerQuery = query(
                collection(db, "leagues/phf2122/players"),
                where("playerId", "in", players),
                orderBy("rankings.overall", "asc")
            );

            const playerQuerySnapshot = await getDocs(playerQuery);
            playerQuerySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const data = doc.data();
                skaters.push(data);
            });
        }
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
        revalidate: 20,
    };
}
