import React, { useState, useEffect } from "react";
import "./levelCheck.css";

export default function LevelCheck(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (props.online) {
    props.postRun(
      props.callStackComps,
      props.attemptId,
      props.playerPositionsArray,
      props.playerAcceptablePositionsArray,
      props.score,
      true
    );
    props.endAttempt(props.attemptId);
  }
  function handleReset() {
    props.resetPlayer(
      props.userId,
      props.levelId,
      props.playerPositionsArray[0],
      props.targetPosition
    );
  }
  return ( show &&
    <div id="overlay" className="overlay">
      <div id="winner">
        <span>
          Portal Locked! <br />
          You Win
        </span>
        <button
          id="restartBtn"
          key="restart"
          name="restart"
          className="levelCheckBtn"
          onClick={handleReset}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
