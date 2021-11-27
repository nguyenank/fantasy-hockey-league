import "../styles/globals.css";
import init from "../utils/init";

init();

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
