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
      true,
      props.user.token
    );
    props.endAttempt(props.attemptId, props.user.token);
  }
  function handleReset() {
    props.resetPlayer(
      props.user.userName,
      props.levelId,
      props.playerPositionsArray[0],
      props.targetPosition,
      props.user.token
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
