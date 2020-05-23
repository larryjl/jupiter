import React, { useState } from "react";
import "./menu.css";
import { ReactComponent as MenuSvg } from "../..//images/Icon_menu.svg";
import Score from "./scoreComp";
import { googleSignOut } from "../login/googleLoginComp";

export default function Menu(props) {
  const {
    endAttempt,
    attemptId,
    user,
    setUser,
    setIsSignedIn,
    online,
    setOnline,
    resetPlayer,
    levelId,
    playerPosition,
    targetPosition,
  } = props;
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
  async function handleClickRestart() {
    try {
      await endAttempt(attemptId, user.token);
    } catch (error) {
      setOnline(false);
    }
    resetPlayer(
      user.userName,
      levelId,
      playerPosition,
      targetPosition,
      user.token
    );
    setMenuOpen(false);
  }
  async function handleClickSignOut() {
    try {
      await Promise.all([
        endAttempt(attemptId, user.token),
        user.type !== "guest" ? googleSignOut() : null,
      ]);
    } catch (error) {
      setOnline(false);
    }
    setMenuOpen(false);
    setUser(null);
    setTimeout(() => {
      setIsSignedIn(false); // unmount
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
        <div
          id="menuOverlay"
          className="overlay"
          onClick={handleClickOverlay}
        ></div>
      )}
      <nav id="menuNav" className={menuOpen ? "open" : "closed"}>
        {buttons}
      </nav>
      <div id="scoreTab" className={scoreOpen ? "open" : "closed"}>
        <Score
          user={user}
          online={online}
          setOnline={setOnline}
          scoreOpen={scoreOpen}
        />
      </div>
    </div>
  );
}
