import React, { useState } from "react";
import "./Sideboard.css";
import Translation from "../translation/translationComp";
import Rotation from "../rotation/rotationComp";
import Reflection from "../reflection/reflectionComp";
import { ReactComponent as TranslationSvg } from "../../images/btnTrans.svg";
import { ReactComponent as RotationSvg } from "../../images/btnRot.svg";
import { ReactComponent as ReflectionSvg } from "../../images/btnReflect.svg";

function Sideboard(props) {
  const [tab, setTab] = useState(null);

  function handleClick(e) {
    if (e.currentTarget.id === "translation-button") {
      setTab("translation");
    } else if (e.currentTarget.id === "reflection-button") {
      setTab("reflection");
    } else if (e.currentTarget.id === "rotation-button") {
      setTab("rotation");
    }
  }

  return (
    <div id="sideboard">
      <nav>
        <button
          id="translation-button"
          className="tabBtn iconBtn"
          onClick={handleClick}
        >
          <TranslationSvg 
            alt="Translation" 
            tabIndex="0"
            className={(tab === "translation")? "activeTab": ""}
          />
        </button>
        <button
          id="rotation-button"
          className="tabBtn iconBtn"
          onClick={handleClick}
        >
          <RotationSvg 
            alt="Rotation" 
            tabIndex="0"
            className={(tab === "rotation")? "activeTab": ""}
          />
        </button>
        <button
          id="reflection-button"
          className="tabBtn iconBtn"
          onClick={handleClick}
        >
          <ReflectionSvg 
            alt="Reflection" 
            tabIndex="0"
            className={(tab === "reflection")? "activeTab": ""}
          />
        </button>
      </nav>
      {tab === "translation" && (
        <Translation
          translate={props.translate}
          translationFactor={props.translationFactor}
          handleChange={props.handleChange}
          addToStack={props.addToStack}
        />
      )}
      {tab === "rotation" && (
        <Rotation
          rotate={props.rotate}
          pivotPointx={props.pivotPointx}
          pivotPointy={props.pivotPointy}
          rotationMag={props.rotationMag}
          handleChange={props.handleChange}
          addToStack={props.addToStack}
        />
      )}
      {tab === "reflection" && (
        <Reflection
          reflect={props.reflect}
          lineOfReflection={props.lineOfReflection}
          handleChange={props.handleChange}
          addToStack={props.addToStack}
        />
      )}
    </div>
  );
}

export default Sideboard;
