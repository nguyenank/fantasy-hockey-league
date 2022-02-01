import React from "react";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "./styles/Footer.module.scss";

export default function Footer() {
    return (
        <div className={styles.footer}>
            <hr className={styles.hr} />
            <p>Last updated February 1, 2022.</p>
            <p>
                This site was created by{" "}
                <a href="https://twitter.com/nguyenank_">An Nguyen</a> using
                Next.js, based on the{" "}
                <a href="https://www.theicegarden.com/2021/11/4/22760382/the-ice-garden-fantasy-hockey-nwhl-phf-2021-22-womens-hockey">
                    PHF 2021-2022 Fantasy League
                </a>{" "}
                run by{" "}
                <a href="https://www.theicegarden.com/">The Ice Garden</a>.{" "}
            </p>
            <p>
                Data is taken from a{" "}
                <a href="https://docs.google.com/spreadsheets/d/15kkJUbxm7UAyq57Ujxv9BORk2vb06M6Ck1bL7XkPC30/edit?usp=sharing">
                    spreadsheet of counting stats
                </a>{" "}
                collected by{" "}
                <a href="https://twitter.com/DigDeepBSB">Mike Murphy</a> as well
                as the{" "}
                <a href="https://www.premierhockeyfederation.com/">
                    PHF website
                </a>
                .
            </p>
            <p>
                The source code for the application is available at{" "}
                <a href="https://github.com/nguyenank/fantasy-hockey-league">
                    GitHub
                </a>
                .
            </p>
        </div>
    );
}
