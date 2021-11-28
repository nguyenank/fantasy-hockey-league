import Layout from "../../components/Layout";
import IndividualTable from "../../components/IndividualTable";
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
    const teamMap = {
        TOR: "Toronto Six (TOR)",
        CTW: "Connecticut Whale (CTW)",
        BOS: "Boston Pride (BOS)",
        MIN: "Minnesota Whitecaps (MIN)",
        MET: "Metropolitan Riveters (MET)",
        BUF: "Buffalo Beauts (BUF)",
    };
    return (
        <Layout pageHeader={player ? player.name : "Player Not Found"}>
            {player ? (
                <div className={styles.columns}>
                    {" "}
                    <div>
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
                            {teamMap[player.team]}
                        </div>
                        <div>
                            <span className={styles.bold}>
                                {"Fantasy Value: "}
                            </span>
                            {player.fantasy_value}
                        </div>

                        {player.position !== "G" && (
                            <>
                                <div>
                                    <span className={styles.bold}>
                                        {
                                            "Past Scoring Rates for Various Leagues"
                                        }
                                    </span>
                                </div>
                                <ul className={styles.list}>
                                    <li>
                                        <span className={styles.bold}>
                                            {"PHF: "}
                                        </span>
                                        {player.league_scoring_rates.phf
                                            ? player.league_scoring_rates.phf
                                            : 0}
                                    </li>
                                    <li>
                                        <span className={styles.bold}>
                                            {"NCAA: "}
                                        </span>
                                        {player.league_scoring_rates.ncaa
                                            ? player.league_scoring_rates.ncaa
                                            : 0}
                                    </li>
                                    <li>
                                        <span className={styles.bold}>
                                            {"U Sports: "}
                                        </span>
                                        {player.league_scoring_rates.usports
                                            ? player.league_scoring_rates
                                                  .usports
                                            : 0}
                                    </li>
                                    <li>
                                        <span className={styles.bold}>
                                            {"NCAA DIII: "}
                                        </span>
                                        {player.league_scoring_rates.ncaa_diii
                                            ? player.league_scoring_rates
                                                  .ncaa_diii
                                            : 0}
                                    </li>
                                    <li>
                                        <span className={styles.bold}>
                                            {"SDHL: "}
                                        </span>
                                        {player.league_scoring_rates.sdhl
                                            ? player.league_scoring_rates.sdhl
                                            : 0}
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>
                    <div>
                        <div>
                            <span className={styles.bolder}>
                                {"Current Stats"}
                            </span>
                        </div>
                        <IndividualTable
                            data={{ ...player.stats, points: player.points }}
                            position={
                                player.position === "G" ? "goalie" : "skater"
                            }
                        />
                    </div>
                </div>
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
