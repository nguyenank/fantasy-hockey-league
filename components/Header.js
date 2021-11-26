import React from "react";
import Link from "next/link";

const styles = {
    container: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 16,
    },
    versionsContainer: {
        marginLeft: 0,
        marginRight: "auto",
    },
    button: {
        marginLeft: 16,
        cursor: "pointer",
    },
};

const Header = ({ email, signOut }) => (
    <div style={styles.container}>
        <div style={styles.versionsContainer}>
            <h1>Fantasy Hockey League</h1>
        </div>
        {email ? (
            <>
                <p>Signed in as {email}</p>
                <button
                    type="button"
                    onClick={() => {
                        signOut();
                    }}
                    style={styles.button}
                >
                    Sign out
                </button>
            </>
        ) : (
            <>
                <p>You are not signed in.</p>
                <Link href="/auth">
                    <a>
                        <button type="button" style={styles.button}>
                            Sign in
                        </button>
                    </a>
                </Link>
            </>
        )}
    </div>
);

export default Header;
