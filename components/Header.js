import Link from "next/link";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "./styles/Header.module.scss";
import Hamburger from "hamburger-react";

export default function Header() {
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    console.log(user);
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
                <div className={styles.bold}>
                    {user ? user.email : "Not Signed In"}
                </div>
                <Hamburger toggled={isOpen} toggle={setOpen} />
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
                            <Link href="/select-team">
                                <a className={styles.link}>
                                    <span>View Team</span>
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
                </div>
            )}
        </>
    );
}
