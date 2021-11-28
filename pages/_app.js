import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/globals.scss";
import init from "../utils/init";

init();

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
