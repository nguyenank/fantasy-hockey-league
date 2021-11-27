import Layout from "../../components/Layout";
import {
    collection,
    query,
    getDocs,
    getFirestore,
    limit,
    doc,
    getDoc,
    orderBy,
} from "firebase/firestore";
import styles from "./player.module.scss";

export default function Player({ player }) {
    return (
        <Layout pageHeader={player.name}>
            <div>
                <span className={styles.bold}>{"Name: "}</span>
                {player.name}
            </div>
            <div>
                <span className={styles.bold}>{"Age: "}</span>
                {player.age}
            </div>
            <div>
                <span className={styles.bold}>{"Position: "}</span>
                {player.position}
            </div>
            <div>
                <span className={styles.bold}>{"Team: "}</span>
                {player.team}
            </div>
            <div>
                <span className={styles.bold}>{"Fantasy Value: "}</span>
                {player.fantasy_value}
            </div>
            <div>
                <span className={styles.bold}>{"Points: "}</span>
                {player.points}
            </div>
        </Layout>
    );
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const db = getFirestore();
    let players = [];

    const playerQuery = query(
        collection(db, "leagues/phf2122/players"),
        orderBy("points", "desc"),
        limit(10)
    );

    const playerQuerySnapshot = await getDocs(playerQuery);
    playerQuerySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        players.push({ params: { id: doc.data().playerId } });
    });

    return { paths: players, fallback: false };
}
export async function getStaticProps({ params }) {
    const db = getFirestore();
    const docRef = doc(db, "leagues/phf2122/players", params.id);
    const docSnap = await getDoc(docRef);

    return {
        props: {
            player: docSnap.data(),
        },
    };
}
