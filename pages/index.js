import React from "react";
import Layout from "../components/Layout";

export default function Demo() {
    return (
        <Layout pageHeader={"Home"}>
            <p>
                This page does not require authentication, so it won't redirect
                to the login page if you are not signed in.
            </p>
            <p>
                If you remove `getServerSideProps` from this page, it will be
                static and load the authed user only on the client side.
            </p>
        </Layout>
    );
}
