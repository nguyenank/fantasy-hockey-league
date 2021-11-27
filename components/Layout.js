import Header from "./Header";
import Footer from "./Footer";
import styles from "./styles/Layout.module.scss";

export default function Layout(props) {
    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.content}>
                <h3>{props.pageHeader}</h3>
                {props.children}
            </div>
            <Footer />
        </div>
    );
}
