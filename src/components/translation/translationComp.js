import React from "react";
import { ReactComponent as ArrowSvg } from "../../images/btnTransArrow.svg";
import { ReactComponent as GeneralTranslation } from "../../images/btnTrans.svg";

import "./translation.css";

function Translation(props) {
  function handleClick(e) {
    // props.translate(e, ...buttonInfo[e.currentTarget.name].values);
    const desc = `Move shape ${props.translationFactor} units ${e.currentTarget.name}`
    let para = [e, ...buttonInfo[e.currentTarget.name].values]
    props.addToStack(GeneralTranslation, desc, props.translate, para)
  }

  const buttonInfo = {
    up: {values: [0, -100], class: "upBtn"},
    left: {values: [-100, 0], class: "leftBtn"},
    right: {values: [100, 0], class: "rightBtn"},
    down: {values: [0, 100], class: "downBtn"},
  };

  const buttons = [];
  for (let key in buttonInfo) {
    buttons.push(
      <button
        onClick={handleClick}
        key={key}
        name={key}
        alt={`${key} button`}
        id={key}
        className="controlBtn iconBtn"
      >
        <ArrowSvg 
          className={buttonInfo[key].class}
        />
      </button>
    );
  }

  const selector = [];
  for (let i = 1; i <= 18; i++) {
    selector.push(<option key={i}>{i}</option>);
  }

  return (
    <div id="translation" className="tab">
      <div className="controls">
        <select
          name="setTranslationFactor"
          onChange={props.handleChange}
          value={props.translationFactor}
          id="factorBox"
          className="controlSelect"
        >
          {selector}
        </select>
        {buttons}
      </div>
    </div>
  );
}

export default Translation;
