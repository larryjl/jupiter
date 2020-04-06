import { fetchJson } from "./fetch";

  async function endAttempt(attemptId) {
    await fetchJson("Attempts/EndAttempt/" + attemptId, "PATCH");
  }

  async function postAttempt(userId, levelId, startPosition, targetPosition) {
    const attemptBody = {
      playerId: userId,
      levelId: levelId,
      StartPosition: JSON.stringify(startPosition),
      TargetPosition: JSON.stringify(targetPosition)
    }
    const attemptJson = await fetchJson("Attempts", "POST", attemptBody);
    return attemptJson.id;
  }

  async function postRun(callStackComps, attemptId, playerPositionsArray, playerAcceptablePositionsArray, score, success=false) {
    const callStackFunctions = callStackComps.map(v => v.props.desc);
    const runBody = {
      AttemptId: attemptId,
      Functions: JSON.stringify(callStackFunctions),
      PlayerPositions: JSON.stringify(playerPositionsArray),
      PlayerAcceptablePositions: JSON.stringify(playerAcceptablePositionsArray),
      score: score,
      success: success
    }
    await fetchJson("FunctionsRuns", "POST", runBody);
  }

  export { endAttempt, postAttempt, postRun }