import React, { useState } from "react";
import "./menu.css";
import { ReactComponent as MenuSvg } from "../..//images/Icon_menu.svg";
import Score from "./scoreComp";
import { googleSignOut } from "../login/googleLoginComp";

export default function Menu(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);

  function handleClickMenu() {
    setMenuOpen((previous) => !previous);
    if (scoreOpen) {
      setScoreOpen(false);
    }
  }
  function handleClickOverlay() {
    setMenuOpen(false);
    setScoreOpen(false);
  }

  async function handleClickScores() {
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
    highScoresBtn: { handleClick: handleClickScores, text: "High Scores" },
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
        onClick={handleClickMenu}
        className={menuOpen || scoreOpen ? "open" : "closed"}
      >
        <MenuSvg alt="menu" tabIndex="0" />
      </button>
      {(menuOpen || scoreOpen) && (
        <div id="menuOverlay" className="overlay" onClick={handleClickOverlay}></div>
      )}
      <nav id="menuNav" className={menuOpen ? "open" : "closed"}>
        {buttons}
      </nav>
      <div id="scoreTab" className={scoreOpen ? "open" : "closed"}>
        <Score 
          user = {props.user} 
          online = {props.online}
          scoreOpen = {scoreOpen}
        />
      </div>
    </div>
  );
}
