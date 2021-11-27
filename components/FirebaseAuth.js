/* globals window */
import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import init from "../utils/init";

const uiConfig = {
    signInFlow: "popup",
    // Auth providers
    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    signInSuccessUrl: "/",
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
        },
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        },
    ],
};

function SignInScreen() {
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()} />;
}

export default SignInScreen;
