import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Layout from "../components/Layout";

export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const db = getFirestore();
    let players = [];

    const q = query(collection(db, "leagues/phf2122/players"), limit(3));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        players.push(doc.data());
    });

    return {
        props: {
            players,
        },
    };
}

export default function Demo({ players }) {
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    return (
        <Layout pageHeader={"Select Team"}>
            {user ? (
                players.map(p => <div key={p.userId}>{p.name}</div>)
            ) : (
                <div>You must be signed in to select a team!</div>
            )}
        </Layout>
    );
}
