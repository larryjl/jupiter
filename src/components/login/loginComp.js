/* global gapi */ // Do not remove. Indicates predefined global variable.
import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./login.css";
import { clientIds } from "../../config.js";
import loadScript from "../../scripts/loadScript";
import loginFxs from "./loginFunctions"
import LoadIcon from "../loadIcon/loadIcon";

export default function Login(props) {
  const { setIsSignedIn, setUser, setCurrentLevel, online, setOnline } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginMsg, setLoginMsg] = useState("Loading Google Sign-in.");
  const [gapiLoaded, setGapiLoaded] = useState(false);


  // --- Google Login ---
  const startSession = useCallback(async (userObject) => {
    const playerId = await loginFxs.getPlayerId(userObject);
    if (!playerId) {
      setPasswordMsg("Login Failed.")
      setOnline(false)
      return;
    }

    setUser({
      userName: userObject.userName,
      id: playerId,
      type: userObject.type
    });

    const level = await loginFxs.getLevel(online, userObject.type, playerId);
    setCurrentLevel(level);

    setIsSignedIn(true); // component will unmount
  }, [online, setCurrentLevel, setIsSignedIn, setOnline, setUser]);

  const gapiSetup = useCallback(async () => {

    async function handleSuccess(googleUser) {
      setLoginMsg("Signing in...");
      const idToken = googleUser.getAuthResponse().id_token;
      const googleId = await loginFxs.verifyGToken(idToken);
      if (!googleId) {
        setLoginMsg("Google verification failed.");
        setLoading(false);
        return
      }
      await startSession({
        userName: googleId,
        type: "google"
      });
    }

    function handleFailure() {
      setLoginMsg("Google sign-in failed.")
      setLoading(false);
      setIsSignedIn(false);
    }

    if (window.gapi) {
      setGapiLoaded(true);
      gapiLoadedRef.current = true;
      setLoginMsg("");
      setLoading(false);
    }

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
  }, [setIsSignedIn, startSession]);

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
  }, [gapiSetup]);
  // ---

  // --- Regular Login ---
  function handleLogin() {
    setUsernameMsg("");
    setPasswordMsg("");
    let validUsername = loginFxs.validateUsername(username)
    if (!validUsername) {
      setUsernameMsg(
        "Must be 6 or more characters, starting with a letter, with no spaces."
      );
    }
    let validPassword = loginFxs.validatePassword(password)
    if (!validPassword) {
      setPasswordMsg("Must be 8 or more characters, with no spaces.");
    }
    if (validUsername && validPassword) {
      startSession({
        userName: username,
        type: "login",
        password: password
      });
    }
  }

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }
  // --- 

  // --- Guest Login ---
  function handleGuest() {
    const userObject = {
      userName: `guest-${uuidv4()}`,
      type: "guest"
    };
    if (online) {
      startSession(userObject);
    } else {
      setUser(userObject);
      setIsSignedIn(true); // component will unmount
    }
  }
  // ---

  const offlineLogin = (
    <div id="login" className="overlay">
      <div className="loginItem">
        <div className="loginLabel">
          The player database is temporarily unavailable.
        </div>
        <button
          id="guestBtn"
          className="loginBtn"
          key="guestBtn"
          onClick={handleGuest}
        >
          Play Offline
        </button>
      </div>
    </div>
  );

  return !online
    ? offlineLogin
    : (
      <div id="login" className="overlay">
        <div className="loginItem">
          <label htmlFor="username" className="loginLabel">
            {`Username: ${usernameMsg}`}
          </label>
          <input
            type="text"
            autoComplete="username"
            id="username"
            name="username"
            key="username"
            className="loginInput"
            value={username}
            onChange={handleUsername}
          ></input>
        </div>
        <div className="loginItem">
          <label htmlFor="password" className="loginLabel">
            {`Password: ${passwordMsg}`}
          </label>
          <input
            type="password"
            autoComplete="current-password"
            id="password"
            name="password"
            key="password"
            className="loginInput"
            value={password}
            onChange={handlePassword}
          ></input>
        </div>
        <button
          id="loginBtn"
          className="loginBtn"
          key="loginBtn"
          onClick={handleLogin}
        >
          Sign in
    </button>
        <button
          id="guestBtn"
          className="loginBtn"
          key="guestBtn"
          onClick={handleGuest}
        >
          Play as a Guest
    </button>
        <div className="loginItem">
          {gapiLoaded &&
            <button id="gLoginBtn"></button>
          }
          <div className="loginLabel">
            {loginMsg}{loading && <LoadIcon />}
          </div>
        </div>
      </div>
    );
}

async function googleSignOut() {
  const auth2 = await gapi.auth2.getAuthInstance();
  await auth2.signOut();
}

export { googleSignOut };