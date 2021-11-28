import Link from "next/link";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "./styles/Header.module.scss";
import Hamburger from "hamburger-react";

export default function Header() {
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <Link href="/">
                        <a className={styles.link}>
                            <h1>Fantasy Hockey League</h1>
                        </a>
                    </Link>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.bold}>
                        {user ? user.email : "Not Signed In"}
                    </div>
                    <Hamburger toggled={isOpen} toggle={setOpen} />
                </div>
            </div>
            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.hr}></div>
                    {!user ? (
                        <Link href="/auth">
                            <a className={styles.link}>
                                <span>Sign In</span>
                            </a>
                        </Link>
                    ) : (
                        <>
                            <Link href={`/teams/${user.uid}`}>
                                <a className={styles.link}>
                                    <span>Your Team</span>
                                </a>
                            </Link>
                            <a
                                className={styles.link}
                                onClick={() => {
                                    signOut(auth);
                                }}
                            >
                                <span>Sign Out</span>
                            </a>
                        </>
                    )}
                    <h5 className={styles.leaderboard}>Leaderboards</h5>
                    <Link href="/team-leaderboard">
                        <a className={styles.link}>
                            <span>Teams</span>
                        </a>
                    </Link>
                    <Link href="/player-leaderboard">
                        <a className={styles.link}>
                            <span>Players</span>
                        </a>
                    </Link>
                    <Link href="/skater-leaderboard">
                        <a className={styles.link}>
                            <span>Skaters</span>
                        </a>
                    </Link>
                    <Link href="/goalie-leaderboard">
                        <a className={styles.link}>
                            <span>Goalies</span>
                        </a>
                    </Link>
                </div>
            )}
        </>
    );
}
