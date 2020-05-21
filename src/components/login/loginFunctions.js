import { fetchJson } from "../../scripts/fetch";
import { v4 as uuidv4 } from 'uuid';

const validateUsername = (username) =>
  username.length >= 6 &&
  username.length <= 128 &&
  !username.includes(" ") &&
  /^[a-zA-Z]/.test(username.charAt(0)) &&
  username.indexOf("guest") !== 0;

const validatePassword = password => (
  password.length >= 6 && password.length <= 128 && !password.includes(" ")
);

async function authenticate(username, password = "") {
  // try {
  let json = await fetchJson("auth", "POST", { "username": username, "password": password });
  return json;
  // } catch (error) {
  //   return JSON.parse(error.message);
  // }
}

async function register(username, password = "") {
  // try {
  let json = await fetchJson("register", "POST", { "username": username, "password": password })
  return json;
  // } catch (error) {
  //   return JSON.parse(error.message);
  // }
}

async function logGuest(online) {
  let userName = "guest-" + uuidv4();
  const userObject = {
    userName: userName,
    type: "guest"
  };
  if (online) {
    let json = await register(userName);
    json = await authenticate(userName);
    userObject.token = json.access_token;
  }
  return userObject;
}

async function logGoogle(googleId) {
  let userName = "google-" + googleId;
  const user = {
    userName: userName,
    type: "google",
  };
  let json = await register(userName);
  json = await authenticate(userName);
  user.token = json.access_token;

  return user;
}

export default {
  validateUsername: validateUsername,
  validatePassword: validatePassword,
  authenticate: authenticate,
  register: register,
  logGuest: logGuest,
  logGoogle: logGoogle,
};
