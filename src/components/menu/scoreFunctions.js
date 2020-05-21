import { getUserAttempts, getAttempts, getSequences } from "../../scripts/fetchFunctions";

function countMatchingObjects(array, compareKey, matchValue, filter) {
  let count = 0;
  let filteredCount = 0;
  for (const v of array) {
    if (v[compareKey] === matchValue) {
      count++;
    }
    if (v[filter]) {
      filteredCount++;
    }
  }
  return [count, filteredCount];
}

export async function getScore(username, token) {
  let attempts = [];
  if (username) {
    attempts = await getUserAttempts(username, token);
  } else {
    attempts = await getAttempts(token);
  }
  let runs = await getSequences(token);
  const scores = attempts.reduce((cumulator, v) => {
    const [runCount, successCount] = countMatchingObjects(
      runs,
      "attemptId",
      v.id,
      "success"
    );
    const success = successCount > 0 ? "Yes" : "No";
    if (runCount > 0) {
      const score = runCount;
      cumulator.push({
        playerId: v.playerId,
        levelId: v.levelId,
        score: score,
        success: success,
      });
    }
    return cumulator;
  }, []);

  scores.sort((a, b) => Number(a.score) - Number(b.score));
  scores.sort((a, b) => Number(b.levelId) - Number(a.levelId));

  const emptyScores = [];
  for (let i = 0; i < 10; i++) {
    emptyScores.push({ playerID: "", levelId: "", score: "", success: "" });
  }

  return scores.concat(emptyScores);
}
