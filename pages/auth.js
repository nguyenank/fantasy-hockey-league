import React from "react";
import Layout from "../components/Layout";
import FirebaseAuth from "../components/FirebaseAuth";

const styles = {
    content: {
        padding: `8px 32px`,
    },
    textContainer: {
        display: "flex",
        justifyContent: "center",
        margin: 16,
    },
};

export default function Auth() {
    return (
        <Layout pageHeader={"Sign In / Register"}>
            <p>Login or make an account!</p>

            <FirebaseAuth />
        </Layout>
    );
}
