import React from "react";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "./styles/Footer.module.scss";

export default function Footer() {
    return (
        <div className={styles.footer}>
            <hr />
            This site was created by An Nguyen.
        </div>
    );
}
