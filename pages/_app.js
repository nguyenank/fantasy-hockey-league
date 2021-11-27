import "./styles/globals.css";
import init from "../utils/init";
import "bootstrap/dist/css/bootstrap.min.css";

init();

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
