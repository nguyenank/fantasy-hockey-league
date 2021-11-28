import Header from "./Header";
import Footer from "./Footer";
import Head from "next/head";
import styles from "./styles/Layout.module.scss";

export default function Layout(props) {
    return (
        <div className={styles.layout}>
            <Head>
                <title>
                    {props.pageHeader !== ""
                        ? `${props.pageHeader} | Fantasy Hockey League`
                        : "Fantasy Hockey League"}
                </title>
            </Head>
            <Header />
            <div className={styles.content}>
                <h3>{props.pageHeader}</h3>
                {props.children}
            </div>
            <Footer />
        </div>
    );
}
