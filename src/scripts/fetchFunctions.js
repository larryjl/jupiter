import { fetchJson } from "./fetch";

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
}

export { endAttempt, postAttempt, postRun };
