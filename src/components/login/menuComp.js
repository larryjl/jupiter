/* global gapi */
import React, { useState, useEffect } from "react";
import "./login.css";
import { ReactComponent as MenuSvg } from "../..//images/Icon_menu.svg";
import { fetchJson } from "../../scripts/fetch";


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

async function getScore(playerId) {
  let attemptsJson = [];
  attemptsJson = await fetchJson("Attempts" + (playerId? "/PlayerId=" + playerId : ""), "GET");
  let runsJson = [];
  runsJson = await fetchJson("FunctionsRuns", "GET");
  const scores = attemptsJson.reduce((cumulator, v) => {
    const [runCount, successCount] = countMatchingObjects(runsJson, "attemptId", v.id, "success");
    const success = (successCount > 0) ? "Yes" : "No";
    if (runCount > 0) {
      const score = runCount;
      cumulator.push(
        {playerId: v.playerId, levelId: v.levelId, score: score, success: success}
      );
    }
    return cumulator;
  }, []);

  scores.sort((a, b) => Number(a.score) - Number(b.score));
  scores.sort((a, b) => Number(b.levelId) - Number(a.levelId));

  const emptyScores = [];
  for (let i=0; i<10; i++) {
    emptyScores.push(
      {playerID: "", levelId: "", score: "", success: ""}
    );
  }

  return scores.concat(emptyScores);
}

export default function Menu(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  // const [overlay, setOverlay] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(null);

  function handleMenu() {
    setMenuOpen(previous => !previous);
    if (scoreOpen) {
      setScoreOpen(false);
    }
  }
  function handleOverlay() {
    setMenuOpen(false);
    setScoreOpen(false);
  }
  async function scoreTable() {
    const scores = await getScore(props.user.id);
    const scoreRows = [];
    for (let i=0; i<5; i++) {
      scoreRows.push(
      <tr key = {i} className = {scores[i].success ? "highlight" : ""}>
        <td key = "level">{scores[i].levelId}</td>
        <td key = "score">{scores[i].score}</td>
        <td key = "success">{scores[i].success}</td>
      </tr>
    )};
    return (<table id="highScore">
      <thead>
        <tr key="head">
          <th>Level</th>
          <th>Runs</th>
          <th>Success</th>
        </tr>
      </thead>
      <tbody>
        {scoreRows}
      </tbody>
    </table>);
  } 

  async function handleClickHighScores() {
    if (props.online) {
      setScoreDisplay(await scoreTable());
    } else {
      setScoreDisplay(<p id="noScore">Scores are temporarily unavailable.</p>);
    }
    setScoreOpen(prev => !prev);
    setMenuOpen(prev => !prev);
  }
  function handleClickRestart() {
    props.endAttempt(props.attemptId);
    props.resetPlayer(props.user.id, props.levelId, props.playerPosition, props.targetPosition);
    setMenuOpen(false);
  }
  async function handleClickSignOut() {
    const auth2 = await gapi.auth2.getAuthInstance();
    await auth2.signOut();
    setMenuOpen(false);
    props.setUser(null);
    setTimeout(() => {
      props.setIsSignedIn(false) // unmount
    }, 400);
  }
  const buttonInfo = {
    highScoresBtn: { handleClick: handleClickHighScores, text: "High Scores" },
    restartBtn: { handleClick: handleClickRestart, text: "Restart Level" },
    logoutBtn: { handleClick: handleClickSignOut, text: "Sign Out" }
  };
  const buttons = [];
  for (let key in buttonInfo) {
    buttons.push(
      <button
        onClick={buttonInfo[key].handleClick}
        key={key}
        name={key}
        alt={key}
        id={key}
        className="navBtn"
      >
        {buttonInfo[key].text}
      </button>
    );
  }

  return (
    <div id="menu">
      <button
        id="menuBtn"
        name="menuBtn"
        key="menuBtn"
        onClick={handleMenu}
        className={menuOpen || scoreOpen ? "open" : "closed"}
      >
        <MenuSvg alt="menu" tabIndex="0" />
      </button>
      {(menuOpen || scoreOpen) &&
        <div id="menuOverlay" className="overlay" onClick={handleOverlay}></div>
      }
      <nav id="menuNav" className={menuOpen ? "open" : "closed"}>
        {buttons}
      </nav>
      <div id="scoreTab" className={scoreOpen ? "open" : "closed"}>
        {scoreDisplay}
      </div>
    </div>
  );
}
