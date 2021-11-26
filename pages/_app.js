import "../styles/globals.css";
import initAuth from "../utils/initAuth";

initAuth();

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
