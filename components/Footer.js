import React from "react";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "./styles/Footer.module.scss";

export default function Footer() {
    return (
        <div className={styles.footer}>
            <hr className={styles.hr} />
            This site was created by{" "}
            <a href="https://twitter.com/nguyenank_">An Nguyen</a> using
            Next.js, based on the{" "}
            <a href="https://www.theicegarden.com/2021/11/4/22760382/the-ice-garden-fantasy-hockey-nwhl-phf-2021-22-womens-hockey">
                PHF 2021-2022 Fantasy League
            </a>{" "}
            run by <a href="https://www.theicegarden.com/">The Ice Garden</a>.
        </div>
    );
}
