import styles from "./styles/InfoBlocks.module.scss";
import Link from "next/link";

export default function InfoBlocks({ info }) {
    function makeBlock({ bold, text, href }) {
        if (href) {
            return (
                <Link key={href} href={href}>
                    <a className={styles.blockText}>
                        <span className={styles.bold}>{bold}</span>
                        <span>{text}</span>
                    </a>
                </Link>
            );
        } else {
            return (
                <div key={text} className={styles.blockTextFixed}>
                    <span className={styles.bold}>{bold}</span>
                    <span>{text}</span>
                </div>
            );
        }
    }
    return <div className={styles.blocks}>{info.map(makeBlock)}</div>;
}
