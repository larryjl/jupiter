import { fetchJson } from "../../scripts/fetch";
import { v4 as uuidv4 } from 'uuid';

async function getPlayerId(userObject) {
  let jsonPlayer;
  try {
    if (userObject.type !== "guest") {
      // // todo: login password authentication
      jsonPlayer = await fetchJson("Players/=" + userObject.userName, "GET");
    }
    if (userObject.type === "guest" || !jsonPlayer.id) {
      jsonPlayer = await fetchJson("Players", "POST", userObject);
    }
    if (jsonPlayer.id) {
      return jsonPlayer.id;
    }
  } catch (error) {
    return false;
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
      return 1;
    }
  }
}

const validateUsername = username => (
  username.length >= 6 &&
  username.length <= 128 &&
  !username.includes(" ") &&
  /^[a-zA-Z]/.test(username.charAt(0)) &&
  username.indexOf("guest") !== 0
);

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

async function createGuest(online) {
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


export default {
  getPlayerId: getPlayerId,
  getLevel: getLevel,
  validateUsername: validateUsername,
  validatePassword: validatePassword,
  authenticate: authenticate,
  register: register,
  createGuest: createGuest,
}