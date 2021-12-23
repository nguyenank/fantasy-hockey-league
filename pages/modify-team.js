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
} from "firebase/firestore";
import { default as _ } from "lodash";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

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
    const [user, loading, error] = useAuthState(auth);
    const [selected, setSelected] = useState([]);

    const selectedPlayers = _.filter(
        players,
        (p) => _.indexOf(selected, p.playerId) !== -1
    );

    function toggleRow(id) {
        if (selected.indexOf(id) === -1) {
            setSelected([...selected, id]);
        } else {
            setSelected(_.without(selected, id));
        }
    }

    let content;
    if (!user) {
        content = (
            <>
                <p>You must be logged in to create a team.</p>
                <Link href="/auth">
                    <a>Sign Up / Login</a>
                </Link>
            </>
        );
    } else if (loading) {
        content = <div>Loading </div>;
    } else {
        content = (
            <>
                <div className="center">
                    <PlayerPoolTable players={players} toggleRow={toggleRow} />
                </div>
                <ModifyTeamStatus selectedPlayers={selectedPlayers} />
                <BackToTop />
            </>
        );
    }

    return <Layout pageHeader={"Create / Modify Team"}>{content}</Layout>;
}
