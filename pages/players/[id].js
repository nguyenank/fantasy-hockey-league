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
import _ from "lodash";
import styles from "./player.module.scss";

export default function Player({ player }) {
    return (
        <Layout pageHeader={player ? player.name : "Player Not Found"}>
            {player ? (
                <>
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
                        <span className={styles.bold}>
                            {"Past Scoring Rates for Various Leagues"}
                        </span>
                    </div>
                    <ul className={styles.list}>
                        <li>
                            <span className={styles.bold}>{"PHF: "}</span>
                            {player.league_scoring_rates.phf}
                        </li>
                        <li>
                            <span className={styles.bold}>{"NCAA: "}</span>
                            {player.league_scoring_rates.ncaa}
                        </li>
                        <li>
                            <span className={styles.bold}>{"U Sports: "}</span>
                            {player.league_scoring_rates.usports}
                        </li>
                        <li>
                            <span className={styles.bold}>{"NCAA DIII: "}</span>
                            {player.league_scoring_rates.ncaa_dii}
                        </li>
                        <li>
                            <span className={styles.bold}>{"SDHL: "}</span>
                            {player.league_scoring_rates.sdhl}
                        </li>
                    </ul>
                    <div>
                        <span className={styles.bold}>{"Current Stats"}</span>
                    </div>
                    <ul className={styles.list}>
                        {_.map(player.stats, (value, stat) => (
                            <li>
                                <span className={styles.bold}>
                                    {_.toUpper(stat) + ": "}
                                </span>
                                {value}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <span className={styles.bold}>{"Points: "}</span>
                        {player.points.toFixed(2)}
                    </div>
                </>
            ) : (
                <div>
                    Something went wrong! No player matching this ID could be
                    found.
                </div>
            )}
        </Layout>
    );
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const db = getFirestore();
    let players = [];

    const playerQuery =
        process.env.DATA_FULL === "true"
            ? query(
                  collection(db, "leagues/phf2122/players"),
                  orderBy("points", "desc")
              )
            : query(
                  collection(db, "leagues/phf2122/players"),
                  orderBy("points", "desc"),
                  limit(25)
              );

    const playerQuerySnapshot = await getDocs(playerQuery);
    playerQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        players.push({ params: { id: doc.data().playerId } });
    });

    return { paths: players, fallback: true };
}
export async function getStaticProps({ params }) {
    const db = getFirestore();
    const docRef = doc(db, "leagues/phf2122/players", params.id);
    const docSnap = await getDoc(docRef);

    return {
        props: {
            player: !docSnap.exists() ? null : docSnap.data(),
        },
    };
}
