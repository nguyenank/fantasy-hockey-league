import React from "react";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "./styles/Header.module.scss";

export default function Header() {
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    return (
        <div className={styles.container}>
            <div className={styles.versionsContainer}>
                <Link href="/">
                    <a>
                        <h1>Fantasy Hockey League</h1>
                    </a>
                </Link>
            </div>
            {user ? (
                <>
                    <p>Signed in as {user.email}</p>
                    <button
                        type="button"
                        onClick={() => {
                            signOut(auth);
                        }}
                        className={styles.buttons}
                    >
                        Sign out
                    </button>
                </>
            ) : (
                <>
                    <p>You are not signed in.</p>
                    <Link href="/auth">
                        <a>
                            <button type="button" className={styles.buttons}>
                                Sign in
                            </button>
                        </a>
                    </Link>
                </>
            )}
        </div>
    );
}
