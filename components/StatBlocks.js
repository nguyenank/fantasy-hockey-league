import styles from "./styles/StatBlocks.module.scss";
import Link from "next/link";

export default function StatBlocks({ stats }) {
    function makeBlock({ text, href }) {
        if (href) {
            return (
                <Link key={href} href={href}>
                    <a className={styles.blockText}>{text}</a>
                </Link>
            );
        } else {
            return (
                <div key={text} className={styles.blockTextFixed}>
                    {text}
                </div>
            );
        }
    }
    return <div className={styles.blocks}>{stats.map(makeBlock)}</div>;
}
