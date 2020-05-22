import { getUserSequences } from "../../scripts/fetchFunctions";

export async function getScore(username, token) {
  const sequences = await getUserSequences(username, token);
  if (!sequences) {
    return
  }
  const scores = sequences.map((sequence) => {
    let moves = JSON.parse(sequence.functions).length;
    return {
      levelId: Number(sequence.levelId),
      score: moves,
      success: sequence.success,
    };
  });

  scores.sort((a, b) => b.score - a.score);
  scores.sort((a, b) => a.levelId - b.levelId);
  scores.sort((a, b) => b.success - a.success);
  const emptyScores = [];
  for (let i = 0; i < 10; i++) {
    emptyScores.push({ levelId: "", score: "", success: "" });
  }
  return scores.concat(emptyScores);
}
