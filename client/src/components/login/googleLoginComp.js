/* global gapi */ // Do not remove. Indicates predefined global variable.
import React, { useEffect, useRef, useCallback } from "react";

import { clientIds } from "../../config.js";
import loadScript from "../../scripts/loadScript";
import { gTokenInfo } from "../../scripts/fetch";


async function verifyGToken(idToken) {
  // // verify from google api tokeninfo
  let response = await gTokenInfo(idToken);
  const checkIssuer = iss =>
    iss === "accounts.google.com" || iss === "https://accounts.google.com";
  const checkAud = aud =>
    aud === clientIds.google + ".apps.googleusercontent.com";
  if (!checkIssuer(response.iss) || !checkAud(response.aud)) {
    return false
  }
  return response.sub; // Google ID
}


export default function GoogleLogin(props) {
  const { setLoading, setLoginMsg, successCallback } = props;

  // --- Google API setup ---
  const gapiSetup = useCallback(async () => {
    async function handleSuccess(googleUser) {
      setLoginMsg("Signing in...");
      const idToken = googleUser.getAuthResponse().id_token;
      const googleId = await verifyGToken(idToken);
      if (!googleId) {
        setLoginMsg("Google verification failed.");
        setLoading(false);
        return
      }
      successCallback(googleId);
    }

    function handleFailure() {
      setLoginMsg("Google sign-in failed.")
      setLoading(false);
    }

    if (!window.gapi) {
      setLoginMsg("Google Sign-in is temporarily unavailable.");
      setLoading(false);
    }

    gapiLoadedRef.current = true;
    setLoginMsg("");
    setLoading(false);

    // // initialize google api
    await window.gapi.load("auth2", async () => {
      await gapi.auth2.init({
        client_id: clientIds.google + ".apps.googleusercontent.com",
        fetch_basic_profile: false,
        scope: "profile"
      });
    });

    // // render google api button
    window.gapi.load("signin2", () => {
      const options = {
        scope: "profile",
        width: 300,
        height: 50,
        longtitle: true,
        theme: "light",
        onsuccess: handleSuccess,
        onfailure: handleFailure
      };
      gapi.signin2.render("gLoginBtn", options);
    });

  }, [setLoading, setLoginMsg, successCallback]);
  // --- end Google API setup ---

  const gapiLoadedRef = useRef(false);
  useEffect(() => {
    loadScript("gapi", "https://apis.google.com/js/platform.js", gapiSetup);
    const timer = setTimeout(() => {
      if (gapiLoadedRef.current === false) {
        setLoginMsg("Google Sign-in is temporarily unavailable.");
        setLoading(false);
      }
    }, 5000);
    return (() => clearTimeout(timer));
  }, [gapiSetup, setLoading, setLoginMsg]);
  // ---

  return (
    <button id="gLoginBtn"></button>
  );
}


export async function googleSignOut() {
  if (gapi && gapi.auth2) {
  const auth2 = await gapi.auth2.getAuthInstance();
  await auth2.signOut();
  }
}