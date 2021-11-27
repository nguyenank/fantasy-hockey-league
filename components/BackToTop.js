import Link from "next/link";
import styles from "./styles/BackToTop.module.scss";

export default function BackToTop() {
    return (
        <div className="center">
            <Link href="#top">
                <a className={styles.link}>Back to Top</a>
            </Link>
        </div>
    );
}
