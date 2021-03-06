import fetch from "node-fetch";
import { apiUrls } from "../config";

// -- for local testing without ssl
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: (process.env.NODE_ENV === "test") ? false : true
});
// --

let baseUrl = apiUrls[process.env.NODE_ENV];

async function fetchJson(route, method, body = {}, authToken = "") {
  const init = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    agent: agent
    // // defaults:
    // mode: "cors",
    // cache: "default",
    // credentials: "same-origin",
    // redirect: "follow",
    // referrer: "client"
  };
  if (authToken) {
    init.headers.Authorization = "JWT " + authToken
  }
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    init.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(baseUrl + "/" + route, init);
    if (!response.ok) {
      return {"status": response.status, "text": response.statusText}
    }
    return await response.json();
  } catch (error) {
    const message = `/${route}: ${method} error: ${error.message}`
    throw new Error(message);
  }
}

async function gTokenInfo(idToken) {
  try {
    const response = await fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    );
    if (response.status !== 200) {
      return { status: response.status };
    } else {
      const json = await response.json();
      return json;
    }
  } catch (error) {
    const message = ("tokeninfo fetch error: " + error.message);
    throw new Error(message);
  }
}

export { fetchJson, gTokenInfo };
