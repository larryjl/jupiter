import { fetchJson } from "./fetch";

async function endAttempt(attemptId) {
  await fetchJson("Attempts/EndAttempt/" + attemptId, "PATCH");
}

async function postAttempt(
  username,
  levelId,
  startPosition,
  targetPosition,
  token
) {
  const attemptBody = {
    levelId: levelId,
    startPosition: JSON.stringify(startPosition),
    targetPosition: JSON.stringify(targetPosition),
  };
  const attemptJson = await fetchJson(
    "attempt/username=" + username,
    "POST",
    attemptBody,
    token
  );
  return attemptJson.id;
}

async function postRun(
  callStackComps,
  attemptId,
  playerPositionsArray,
  playerAcceptablePositionsArray,
  score,
  success = false
) {
  const callStackFunctions = callStackComps.map((v) => v.props.desc);
  const runBody = {
    attemptId: attemptId,
    functions: JSON.stringify(callStackFunctions),
    playerPositions: JSON.stringify(playerPositionsArray),
    playerAcceptablePositions: JSON.stringify(playerAcceptablePositionsArray),
    score: score,
    success: success,
  };
  await fetchJson("FunctionsRuns", "POST", runBody);
}

export { endAttempt, postAttempt, postRun };
