import React, { useState, useCallback } from "react";
import "./login.css";
import loginFxs from "./loginFunctions";
import LoadIcon from "../loadIcon/loadIcon";
import GoogleLogin from "./googleLoginComp";
import { googleSignOut } from "./googleLoginComp";

export default function Login(props) {
  const { setIsSignedIn, setUser, setCurrentLevel, online, setOnline } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginMsg, setLoginMsg] = useState("Loading Google Sign-in.");

  const startSession = useCallback(
    (user) => {
      setUser(user);
      setIsSignedIn(true); // component will unmount
    },
    [setIsSignedIn, setUser]
  );

  // --- Google Login ---
  const successCallback = useCallback(
    async (googleId) => {
      const user = await loginFxs.logGoogle(googleId);
      startSession(user);
    },
    [startSession]
  );
  // --- end Google Login ---

  // --- Regular Login ---
  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function validateInputs(username, password) {
    setUsernameMsg("");
    setPasswordMsg("");
    let validUsername = loginFxs.validateUsername(username);
    if (!validUsername) {
      setUsernameMsg(
        "Must be 6 or more characters, starting with a letter, with no spaces."
      );
    }
    let validPassword = loginFxs.validatePassword(password);
    if (!validPassword) {
      setPasswordMsg("Must be 6 or more characters, with no spaces.");
    }
    return validUsername && validPassword;
  }

  async function handleRegister() {
    setUsernameMsg("Registering new user.");
    setLoading(true);
    if (!validateInputs(username, password)) {
      setLoading(false);
      return;
    }
    let json = await loginFxs.register(username, password);
    if (json.status) {
      switch (json.status) {
        case 400:
          setLoading(false);
          setUsernameMsg("That username is taken.");
          return;
        default:
          setLoading(false);
          setOnline(false);
          return;
      }
    }
    setUsernameMsg("User created.");
    handleLogin();
  }

  async function handleLogin() {
    setUsernameMsg("Logging in.");
    setLoading(true);
    let json = await loginFxs.authenticate(username, password);
    let token = json.access_token;
    if (json.status) {
      switch (json.status) {
        case 401:
          setLoading(false);
          setUsernameMsg("Wrong username or password.");
          return;
        default:
          setLoading(false);
          setOnline(false);
          return;
      }
    }
    setLoading(false);
    startSession({
      userName: username,
      type: "login",
      password: password,
      token: token,
    });
  }
  // --- end Regular Login ---

  // --- Guest Login ---
  async function handleGuest() {
    setUsernameMsg("Logging in as guest.");
    setLoading(true);
    googleSignOut();
    const user = await loginFxs.logGuest(online);
    startSession(user);
  }

  // --- end Guest Login ---

  // --- Offline Login ---
  const OfflineLogin = (props) => (
    <div id="login" className="overlay">
      <div className="loginItem">
        <div className="loginLabel">
          The player database is temporarily unavailable.
        </div>
        <button
          id="guestBtn"
          className="loginBtn"
          key="guestBtn"
          onClick={props.handleGuest}
        >
          Play Offline
        </button>
      </div>
    </div>
  );
  // --- end Offline Login ---

  return !online ? (
    <OfflineLogin handleGuest={handleGuest} />
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
        id="registerBtn"
        className="loginBtn"
        key="registerBtn"
        onClick={handleRegister}
      >
        New User
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
        <GoogleLogin
          setLoading={setLoading}
          setLoginMsg={setLoginMsg}
          successCallback={successCallback}
        />
        <div className="loginLabel">
          {loginMsg}
          {loading && <LoadIcon />}
        </div>
      </div>
    </div>
  );
}
