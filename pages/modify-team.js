import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/Layout";
import PlayerPoolTable from "../components/PlayerPoolTable";
import InfoBlocks from "../components/InfoBlocks";
import ModifyTeamStatus from "../components/ModifyTeamStatus";
import BackToTop from "../components/BackToTop";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    doc,
    updateDoc,
} from "firebase/firestore";
import { default as _ } from "lodash";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import styles from "./styles/modify-team.module.css";

export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const db = getFirestore();
    let players = [];
    const playerQuery =
        process.env.DATA_FULL === "true"
            ? query(collection(db, "leagues/phf2122/players"))
            : query(collection(db, "leagues/phf2122/players"), limit(25));

    const playerQuerySnapshot = await getDocs(playerQuery);
    playerQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        players.push(doc.data());
    });

    // create dictionary of {position: rank}
    const positionRanking = ["F", "F/D", "D/F", "D", "G"];
    const posRankDict = _.fromPairs(
        _.zip(positionRanking, _.range(positionRanking.length))
    );

    players = _.orderBy(
        players,
        [(p) => posRankDict[p.position], "team"],
        ["asc", "desc"]
    );

    return {
        props: {
            players,
        },
    };
}

async function saveDraftTeam(userId, teamName, players) {
    const db = getFirestore();
    const docRef = doc(db, "leagues/phf2122/teams", userId);
    await updateDoc(docRef, { teamName: teamName, players: players });
}

async function submitTeam(userId, teamName, players, changes) {
    const db = getFirestore();
    const docRef = doc(db, "leagues/phf2122/teams", userId);
    await updateDoc(docRef, {
        submitted: true,
        teamName: teamName,
        players: players,
        changes: changes,
    });
}

export default function ModifyTeam({ players }) {
    const router = useRouter();
    const auth = getAuth();
    const [user, loadingUser, errorUser] = useAuthState(auth);

    const [currentTeam, loadingTeam, errorTeam] = useDocumentDataOnce(
        user
            ? doc(getFirestore(), "leagues/phf2122/teams", user.uid)
            : undefined
    );
    const [selected, setSelected] = useState(null);
    const [teamName, setTeamName] = useState("");
    const [waiting, setWaiting] = useState(false);

    if (selected === null) {
        if (currentTeam) {
            setSelected(currentTeam.players);
            setTeamName(currentTeam.teamName);
        }
    }

    let content;
    if (loadingUser || loadingTeam || selected === null) {
        content = <div>Loading...</div>;
    } else if (!user) {
        content = (
            <>
                <p>You must be logged in to create a team.</p>
                <Link href="/auth">
                    <a>Sign Up / Login</a>
                </Link>
            </>
        );
    } else {
        const submitted = currentTeam.submitted;

        const originalIds = _.fromPairs(
            _.map(currentTeam.players, (id) => [
                _.findIndex(players, ["playerId", id]),
                true,
            ])
        );

        const selectedPlayers = _.filter(
            players,
            (p) => _.indexOf(selected, p.playerId) !== -1
        );

        const changes = submitted
            ? currentTeam.changes +
              _.max(
                  _.difference(originalIds, selected).length,
                  _.difference(selected, originalIds).length
              )
            : 0;

        function toggleRow(id) {
            if (selected.indexOf(id) === -1) {
                setSelected([...selected, id]);
            } else {
                setSelected(_.without(selected, id));
            }
        }

        content = (
            <>
                <label className={styles.label} htmlFor="team_name">
                    Team Name:
                </label>
                <input
                    id="team_name"
                    name="team_name"
                    type="text"
                    maxLength={50}
                    className={styles.textField}
                    value={teamName}
                    disabled={submitted}
                    onChange={(e) => setTeamName(e.target.value)}
                ></input>
                <div>
                    <span className={styles.label}>Status:</span>
                    {submitted ? "Submitted" : "Unsubmitted"}
                </div>

                <div>
                    <span className={styles.label}>Changes:</span>
                    {submitted ? `${currentTeam.changes}/3` : "∞"}
                </div>
                <div className="center">
                    <PlayerPoolTable
                        players={players}
                        toggleRow={toggleRow}
                        originalIds={originalIds}
                        selectedRowIds={selected}
                    />
                </div>
                <ModifyTeamStatus
                    changes={changes}
                    selectedPlayers={selectedPlayers}
                    submitted={submitted}
                    waiting={waiting}
                    saveDraftTeam={async () => {
                        setWaiting(true);
                        await saveDraftTeam(user.uid, teamName, selected);
                        router.push("/teams/" + user.uid);
                    }}
                    submitTeam={async () => {
                        setWaiting(true);
                        await submitTeam(user.uid, teamName, selected, changes);
                        router.push("/teams/" + user.uid);
                    }}
                />
                <BackToTop />
            </>
        );
    }

    return <Layout pageHeader={"Create / Modify Team"}>{content}</Layout>;
}
