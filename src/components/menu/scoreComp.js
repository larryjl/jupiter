import React, { useState, useEffect } from "react";
import "./score.css";
import { getScore } from "./scoreFunctions";
import LoadIcon from "../loadIcon/loadIcon";

export default function Score(props) {
  const { user, online, scoreOpen } = props;
  const [scoreTable, setScoreTable] = useState(
    <div id="noScore"><LoadIcon theme="dark "/></div>
  );

  useEffect(() => {
    if (scoreOpen) {
      if (online) {
        function buildTable(scores) {
          const scoreRows = [];
          for (let i = 0; i < 5; i++) {
            scoreRows.push(
              <tr key={i} className={scores[i].success ? "highlight" : ""}>
                <td key="level">{scores[i].levelId}</td>
                <td key="score">{scores[i].score}</td>
                <td key="success">{scores[i].success? "Yes": "No"}</td>
              </tr>
            );
          }
          return (
            <table id="scoreTable">
              <thead>
                <tr key="head">
                  <th>Level</th>
                  <th>Moves</th>
                  <th>Success</th>
                </tr>
              </thead>
              <tbody>{scoreRows}</tbody>
            </table>
          );
        }
        async function fillScores(user) {
          let scores = await getScore(user.userName, user.token);
          if (scores) {
            let table = buildTable(scores);
            setScoreTable(table);
          }
        }
        fillScores(user);
      } else {
        setScoreTable(<p id="noScore">Scores are unavailable.</p>)
      }
    }
  }, [user, online, scoreOpen]);

  return (
    <div id="score"> 
      {scoreTable}
    </div>
  )
}
