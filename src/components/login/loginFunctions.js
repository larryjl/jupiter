
import { fetchJson, tokenInfo } from "../../scripts/fetch";
import { clientIds } from "../../config.js";

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

async function verifyGToken(idToken) {
  // // verify from google api tokeninfo
  let response = await tokenInfo(idToken);
  const checkIssuer = iss =>
    iss === "accounts.google.com" || iss === "https://accounts.google.com";
  const checkAud = aud =>
    aud === clientIds.google + ".apps.googleusercontent.com";
  if (!checkIssuer(response.iss) || !checkAud(response.aud)) {
    return false
  }
  return response.sub; // Google ID
}

const validateUsername = username => (
  username.length >= 6 &&
  username.length <= 128 &&
  !username.includes(" ") &&
  /^[a-zA-Z]/.test(username.charAt(0)) &&
  username.indexOf("guest") !== 0
);

const validatePassword = password => (
  password.length >= 8 && password.length <= 128 && !password.includes(" ")
);

export default {
  getPlayerId: getPlayerId,
  getLevel: getLevel,
  verifyGToken: verifyGToken,
  validateUsername: validateUsername,
  validatePassword: validatePassword
}