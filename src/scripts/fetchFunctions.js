import { fetchJson } from "./fetch";

async function authenticate(username, password = "0") {
  let json = await fetchJson("auth", "POST", {
    username: username,
    password: password,
  });
  return json;
}

async function register(username, password = "0") {
  let json = await fetchJson("register", "POST", {
    username: username,
    password: password,
  });
  return json;
}

async function endAttempt(attemptId, token) {
  let json = await fetchJson("attempt/id=" + attemptId, "PATCH", {}, token);
  return json;
}

async function postAttempt(
  username,
  levelId,
  startPosition,
  targetPosition,
  token
) {
  const body = {
    levelId: levelId,
    startPosition: JSON.stringify(startPosition),
    targetPosition: JSON.stringify(targetPosition),
  };
  const json = await fetchJson(
    "attempt/username=" + username,
    "POST",
    body,
    token
  );
  return json.id;
}

async function postRun(
  callStackComps,
  attemptId,
  playerPositionsArray,
  playerAcceptablePositionsArray,
  score,
  success,
  token
) {
  const callStackFunctions = callStackComps.map((v) => v.props.desc);
  const body = {
    functions: JSON.stringify(callStackFunctions),
    playerPositions: JSON.stringify(playerPositionsArray),
    playerAcceptablePositions: JSON.stringify(playerAcceptablePositionsArray),
    score: score,
    success: success,
  };
  let json = await fetchJson("sequence/attemptid=" + attemptId, "POST", body, token);
  return json
}

async function getUserAttempts(username, token) {
  let json = await fetchJson("attempt/username=" + username, "GET", undefined, token);
  return json.attempts
}

async function getAttempts(token) {
  let json = await fetchJson("attempts", "GET", undefined, token);
  return json.attempts
}

async function getSequences(token) {
  let json = await fetchJson("sequences", "GET", undefined, token);
  return json.sequences
}

async function getUserSequences(username, token) {
  let json = await fetchJson("sequence/username=" + username, "GET", undefined, token);
  return json.sequences
}

export { authenticate, register, endAttempt, postAttempt, postRun, getUserAttempts, getAttempts, getSequences, getUserSequences };
