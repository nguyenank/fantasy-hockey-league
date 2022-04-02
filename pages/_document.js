// pages/_document.js

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@200;400;600;700;800&display=swap"
                        rel="stylesheet"
                    />
                    <script
                        defer
                        data-domain="fantasy-hockey-league.vercel.app"
                        src="https://plausible.io/js/plausible.js"
                    ></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
