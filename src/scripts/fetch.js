import fetch from "node-fetch";
import { apiUrls } from "../config";

// for local testing without ssl
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: (process.env.NODE_ENV==="test")? false: true
});
//

let baseUrl = apiUrls[process.env.NODE_ENV];

async function fetchJson(route, method = "POST", body = {}) {
  const init = {
    // Default options are marked with *
    method: method, // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    // redirect: "follow", // manual, *follow, error
    // referrer: "no-referrer", // no-referrer, *client
    agent: agent
  };
  if (method === "POST" || method === "PUT") {
    init.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(baseUrl + "/" + route, init);
    if (method === "PATCH") {
      return; // No json
    }
    return await response.json();
  } catch (error) {
    const message = `/${route}: ${method} error: ${error}`
    // console.log(message);
    throw new Error(message);
  }
}

async function tokenInfo(idToken) {
  try {
    const response = await fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken, 
      {
      method: "GET",
      headers: {"Content-Type": "application/json"}
      }
    );
    if (response.status !== 200) {
      return {status: response.status};
    } else {
      const json = await response.json();
      return json;
    }
  } catch (error) {
    const message = ("tokeninfo fetch error: " + error);
    // console.log(message);
    throw new Error(message);
  }
}

export { fetchJson, tokenInfo };
