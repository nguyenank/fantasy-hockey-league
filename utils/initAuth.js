// ./initAuth.js
import { init } from "next-firebase-auth";

const initAuth = () => {
    init({
        authPageURL: "/auth",
        appPageURL: "/",
        loginAPIEndpoint: "/api/login", // required
        logoutAPIEndpoint: "/api/logout", // required
        // Required in most cases.
        firebaseAdminInitConfig: {
            credential: {
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // The private key must not be accesssible on the client side.
                privateKey: process.env.FIREBASE_PRIVATE_KEY
                    ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
                    : undefined,
            },
        },
        firebaseClientInitConfig: {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        },
        cookies: {
            name: "FantasyHockeyLeague", // required
            // Keys are required unless you set `signed` to `false`.
            // The keys cannot be accessible on the client side.
            keys: [
                process.env.COOKIE_SECRET_CURRENT,
                process.env.COOKIE_SECRET_PREVIOUS,
            ],
            httpOnly: true,
            maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
            overwrite: true,
            path: "/",
            sameSite: "strict",
            secure: false, // set this to false in local (non-HTTPS) development
            signed: true,
        },
    });
};

export default initAuth;
