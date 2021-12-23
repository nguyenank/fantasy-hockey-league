import { useState } from "react";
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
} from "firebase/firestore";
import { default as _ } from "lodash";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";

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

export default function ModifyTeam({ players }) {
    const auth = getAuth();
    const [user, loadingUser, errorUser] = useAuthState(auth);

    const [currentTeam, loadingTeam, errorTeam] = useDocumentDataOnce(
        user
            ? doc(getFirestore(), "leagues/phf2122/teams", user.uid)
            : undefined
    );
    const [selected, setSelected] = useState(null);

    if (selected === null) {
        if (currentTeam) {
            setSelected(currentTeam.players);
        }
    }

    const selectedPlayers = _.filter(
        players,
        (p) => _.indexOf(selected, p.playerId) !== -1
    );

    const selectedIds = _.fromPairs(
        _.map(selected, (id) => [_.findIndex(players, ["playerId", id]), true])
    );

    function toggleRow(id) {
        if (selected.indexOf(id) === -1) {
            setSelected([...selected, id]);
        } else {
            setSelected(_.without(selected, id));
        }
    }

    let content;
    if (loadingUser || loadingTeam || selected === null) {
        content = <div>Loading</div>;
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
        content = (
            <>
                <div className="center">
                    <PlayerPoolTable
                        players={players}
                        toggleRow={toggleRow}
                        selectedRowIds={selectedIds}
                    />
                </div>
                <ModifyTeamStatus selectedPlayers={selectedPlayers} />
                <BackToTop />
            </>
        );
    }

    return <Layout pageHeader={"Create / Modify Team"}>{content}</Layout>;
}
