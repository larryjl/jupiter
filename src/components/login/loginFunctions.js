import { authenticate, register } from "../../scripts/fetchFunctions";
import { v4 as uuidv4 } from "uuid";

const validateUsername = (username) =>
  username.length >= 6 &&
  username.length <= 128 &&
  !username.includes(" ") &&
  /^[a-zA-Z]/.test(username.charAt(0)) &&
  username.indexOf("guest") !== 0;

const validatePassword = (password) =>
  password.length >= 6 && password.length <= 128 && !password.includes(" ");

async function logGuest(online) {
  let userName = "guest-" + uuidv4();
  const user = {
    userName: userName,
    type: "guest",
  };
  if (online) {
    let json = await register(userName);
    json = await authenticate(userName);
    user.token = json.access_token;
  }
  return user;
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
  logGuest: logGuest,
  logGoogle: logGoogle,
};
