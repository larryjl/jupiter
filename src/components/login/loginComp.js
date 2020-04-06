/* global gapi */
import React, { useState, useEffect } from "react";
import "./login.css";
import { keys } from "../../config.js";
import { fetchJson, tokenInfo } from "../../scripts/fetch";
import loadScript from "../../scripts/loadScript";

export default function Login(props) {
  const { setIsSignedIn, setUser, setCurrentLevel, online, setOnline } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [loginMsg, setLoginMsg] = useState("Loading Google Sign-in...");
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    if (window.gapi) {
      gapiSetup();
    } else {
      loadScript("gapi", "https://apis.google.com/js/platform.js", gapiSetup);
    }
  }, []);

  async function gapiSetup() {
    setGapiLoaded(true);
    setLoginMsg("");
    // initialize google api
    await window.gapi.load("auth2", async () => {
      await gapi.auth2.init({
        client_id: keys.clientId + ".apps.googleusercontent.com",
        fetch_basic_profile: false,
        scope: "profile"
      });
    });

    // render google api button
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
  }

  async function getPlayerId(userObject) {
    let jsonPlayer;
    try {
      if (userObject.type !== "guest") {
        // todo: login password authentication
        jsonPlayer = await fetchJson("Players/=" + userObject.userName, "GET");
      }
      if (userObject.type === "guest" || !jsonPlayer.id) {
        jsonPlayer = await fetchJson("Players", "POST", userObject);
      }
      if (jsonPlayer.id) {
        return jsonPlayer.id;
      }
    } catch (error) {
      setOnline(false);
      return;
    }
  }

  async function getLevel(online, userType, playerId) {
    if (!online || userType === "guest") {
      return 1;
    } else {
      try {
        const jsonLevel = await fetchJson(
          "Attempts/LastLevel/PlayerId=" + playerId,
          "GET"
        );
        return jsonLevel[0].levelId;
      } catch (error) {
        // console.log("fetching player's last level failed", error);
        return 1;
      }
    }
  }

  async function startSession(userObject) {
    const playerId = await getPlayerId(userObject);
    if (!playerId) {
      setPasswordMsg("Login Failed.")
      return;
    }

    setUser({
      userName: userObject.userName,
      id: playerId,
      type: userObject.type
    });

    const level = await getLevel(online, userObject.type, playerId);
    setCurrentLevel(level);

    setIsSignedIn(true); // component will unmount
  }

  // --- Google Login ---
  async function verifyToken(idToken) {
    // // verify from back-end
    // let response = await fetchJson("tokensignin", "POST", {idToken: idToken});

    // // verify from google api tokeninfo
    let response = await tokenInfo(idToken);
    const checkIssuer = iss =>
      iss === "accounts.google.com" || iss === "https://accounts.google.com";
    const checkAud = aud =>
      aud === keys.clientId + ".apps.googleusercontent.com";
    if (!checkIssuer(response.iss) || !checkAud(response.aud)) {
      setLoginMsg("Google verification failed.");
    } else {
      return response.sub; // Google ID
    }
  }

  async function handleSuccess(googleUser) {
    setLoginMsg("Signing in...");
    const idToken = googleUser.getAuthResponse().id_token;
    // // get profile info
    // const profile = googleUser.getBasicProfile();
    // const googleId = profile.getId(); // Do not send to your backend! Use an ID token instead.
    // const name = profile.getGivenName();
    // const image = profile.getImageUrl();
    // const email = profile.getEmail(); // This is null if the 'email' scope is not present.

    const googleId = await verifyToken(idToken);
    if (googleId) {
      await startSession({
        userName: googleId,
        type: "google"
      });
    }
  }

  function handleFailure() {
    setLoginMsg("Google sign-in cancelled.")
    setIsSignedIn(false);
  }

  function handleGLoginClick() {
  }

  // --- Regular Login ---

  function validateUsername(username) {
    let valid =
      username.length >= 6 &&
      username.length <= 128 &&
      !username.includes(" ") &&
      /^[a-zA-Z]/.test(username.charAt(0)) &&
      username.indexOf("guest") !== 0;
    if (!valid) {
      setUsernameMsg(
        "Must be 6 or more characters, starting with a letter, with no spaces."
      );
    }
    return valid;
  }

  function validatePassword(password) {
    let valid =
      password.length >= 8 && password.length <= 128 && !password.includes(" ");
    if (!valid) {
      setPasswordMsg("Must be 8 or more characters, with no spaces.");
    }
    return valid;
  }

  function handleLogin() {
    setUsernameMsg("");
    setPasswordMsg("");
    if (validateUsername(username) && validatePassword(password)) {
      startSession({
        userName: username,
        type: "login",
        password: password
      });
    }
  }

  function handleGuest() {
    const userObject = {
      userName: `guest${Date.now()}${Math.random()}`, // somewhat random unique id. consider npm uuid
      type: "guest"
    };
    if (online) {
      startSession(userObject);
    } else {
      setUser(userObject);
      setIsSignedIn(true); // component will unmount
    }
  }

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

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

  return !online ? (
    offlineLogin
  ) : (
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
          <button id="gLoginBtn" onClick={handleGLoginClick}></button>
        }
        <div className="loginLabel">{loginMsg}</div>
      </div>
    </div>
  );
}
