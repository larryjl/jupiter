import React, { useState } from "react";
import "./menu.css";
import { ReactComponent as MenuSvg } from "../..//images/Icon_menu.svg";
import { getScore } from "./scoreFunctions";
import { googleSignOut } from "../login/googleLoginComp";

export default function Menu(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(null);

  function handleMenu() {
    setMenuOpen((previous) => !previous);
    if (scoreOpen) {
      setScoreOpen(false);
    }
  }
  function handleOverlay() {
    setMenuOpen(false);
    setScoreOpen(false);
  }
  async function scoreTable() {
    const scores = await getScore(props.user.userName, props.user.token);
    const scoreRows = [];
    for (let i = 0; i < 5; i++) {
      scoreRows.push(
        <tr key={i} className={scores[i].success ? "highlight" : ""}>
          <td key="level">{scores[i].levelId}</td>
          <td key="score">{scores[i].score}</td>
          <td key="success">{scores[i].success}</td>
        </tr>
      );
    }
    return (
      <table id="highScore">
        <thead>
          <tr key="head">
            <th>Level</th>
            <th>Runs</th>
            <th>Success</th>
          </tr>
        </thead>
        <tbody>{scoreRows}</tbody>
      </table>
    );
  }

  async function handleClickHighScores() {
    if (props.online) {
      setScoreDisplay(await scoreTable());
    } else {
      setScoreDisplay(<p id="noScore">Scores are temporarily unavailable.</p>);
    }
    setScoreOpen((prev) => !prev);
    setMenuOpen((prev) => !prev);
  }
  function handleClickRestart() {
    props.endAttempt(props.attemptId, props.user.token);
    props.resetPlayer(
      props.user.userName,
      props.levelId,
      props.playerPosition,
      props.targetPosition,
      props.user.token
    );
    setMenuOpen(false);
  }
  async function handleClickSignOut() {
    props.endAttempt(props.attemptId, props.user.token);
    if (props.user.type !== "guest") {
      googleSignOut();
    }
    setMenuOpen(false);
    props.setUser(null);
    setTimeout(() => {
      props.setIsSignedIn(false); // unmount
    }, 400);
  }
  const buttonInfo = {
    highScoresBtn: { handleClick: handleClickHighScores, text: "High Scores" },
    restartBtn: { handleClick: handleClickRestart, text: "Restart" },
    logoutBtn: { handleClick: handleClickSignOut, text: "Sign Out" },
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
      {(menuOpen || scoreOpen) && (
        <div id="menuOverlay" className="overlay" onClick={handleOverlay}></div>
      )}
      <nav id="menuNav" className={menuOpen ? "open" : "closed"}>
        {buttons}
      </nav>
      <div id="scoreTab" className={scoreOpen ? "open" : "closed"}>
        {scoreDisplay}
      </div>
    </div>
  );
}
