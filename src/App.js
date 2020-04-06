import React, { useState, useEffect } from "react";
import "./App.css";

import { Grid } from "./components/grid/gridComp";
import Sideboard from "./components/Sideboard/SideboardComp";
import { Circle } from "./components/shapes/circleComp.js";
import { Square } from "./components/shapes/squareComp.js";
import { Triangle } from "./components/shapes/triangleComp.js";
// import { Heart } from "./components/shapes/heartComp.js";
import { Star } from "./components/shapes/starComp.js";
import { Rectangle } from "./components/shapes/rectangleComp.js";
import { CallStack, CallCard } from './components/callStack/callStack';
import Login from './components/login/loginComp';
import Menu from './components/login/menuComp';
import mathFunctions from "./scripts/math.js";
import { endAttempt, postAttempt, postRun } from "./scripts/fetchFunctions";


function Game(props) {
  let shapesArray = ["circle", "square", "star", "rectangle", "triangle"];
  let randomShape = shapesArray[Math.floor(Math.random() * shapesArray.length)];

  const [shape, setShape] = useState(randomShape);

  let size = (Math.floor(Math.random() * 3) + 2) * 100; // returns a random int between 4 and 2 (both inclusive)
  let randomOrientation = Math.floor(Math.random() * 8);
  let startOrientation = [4, 3, 2, 1, -1, -2, -3, -4][randomOrientation];
  randomOrientation = Math.floor(Math.random() * 8);
  let endOrientation = [4, 3, 2, 1, -1, -2, -3, -4][randomOrientation];

  let [startAnchorX, startAnchorY] = mathFunctions.shapeMaker(size);
  const [playerPositionsArray, setPlayerPositionsArray] = useState([[startAnchorX, startAnchorY, size, startOrientation]]);
  const [playerAcceptablePositionsArray, setPlayerAcceptablePositionsArray] = useState([[startAnchorX, startAnchorY, size, startOrientation]]);
  const [playerPosition, setPlayerPosition] = useState([startAnchorX, startAnchorY, size, startOrientation]);

  let [endAnchorX, endAnchorY] = mathFunctions.shapeMaker(size);
  while (
    Math.pow(endAnchorX - startAnchorX, 2) +
    Math.pow(endAnchorY - startAnchorY, 2) <
    Math.pow(2 * size, 2)
  ) {
    [endAnchorX, endAnchorY] = mathFunctions.shapeMaker(size);
  }
  const [targetPosition, setTargetPosition] = useState([endAnchorX, endAnchorY, size, endOrientation]);

  const [fillColour, setFillColour] = useState("rgba(137, 235, 52, 0.6)");
  const [targetFillColour, setTargetFillColour] = useState("rgba(255, 77, 0, 0.6)");
  const [borderColour, setBorderColour] = useState("rgba(255, 255, 255, 1)");
  const [borderWidth, setBorderWidth] = useState(6);
  const [shapeClassName, setShapeClassName] = useState("Circle");

  const [translationFactor, setTranslationFactor] = useState(1);
  const [pivotPointx, setPivotPointx] = useState(0);
  const [pivotPointy, setPivotPointy] = useState(0);
  const [rotationMag, setRotationMag] = useState("180°");
  const [lineOfReflection, setLineOfReflection] = useState(0);
  const transformFunctions = {
    "setTranslationFactor": setTranslationFactor,
    "setPivotPointx": setPivotPointx,
    "setPivotPointy": setPivotPointy,
    "setRotationMag": setRotationMag,
    "setLineOfReflection": setLineOfReflection
  }

  const [callStackComps, setCallStackComps] = useState([]);
  const [counter, setCounter] = useState(0)

  // -- Login hooks --
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [online, setOnline] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [score, setScore] = useState(0);
  useEffect(() => {
    async function startAttempt() {
      if (online && isSignedIn) {
        const newAttemptId = await postAttempt(user.id, currentLevel, playerPositionsArray[0], targetPosition);
        setAttemptId(newAttemptId);
      }
    }
    startAttempt();
  }, [isSignedIn]);
  // --

  let player = {
    id: "myStartPt",
    position: playerPosition,
    fillColour: fillColour,
    borderColour: borderColour,
    borderWidth: borderWidth,
    shapeClassName: shapeClassName
  };

  let target = {
    id: "myEndPt",
    position: targetPosition,
    fillColour: targetFillColour,
    borderColour: borderColour,
    borderWidth: borderWidth,
    shapeClassName: "endPtCircle"
  };

  const changeClass = newName => {
    setShapeClassName(newName);
  };

  // -- Shape Transformations --
  const translate = async (e, deltaX, deltaY) => {
    let currentPlayerPosition = playerAcceptablePositionsArray[playerAcceptablePositionsArray.length-1];
    let newPlayerPosition = mathFunctions.translate(
      currentPlayerPosition,
      deltaX * translationFactor,
      deltaY * translationFactor
    );
    playerPositionsArray.push(newPlayerPosition);
    playerAcceptablePositionsArray.push(newPlayerPosition);
    await changeClass("fade-out");
    await setTimeout(() => {
      setPlayerPosition(newPlayerPosition);
      changeClass("fade-in");
    }, 100);
  };

  const reflect = async (e, lineOfReflection, axis) => { // axis: x = true, y = false
    lineOfReflection = Number(lineOfReflection);
    let currentPlayerPosition = playerAcceptablePositionsArray[playerAcceptablePositionsArray.length-1]
    let newPlayerPosition = mathFunctions.reflect(currentPlayerPosition, lineOfReflection, axis);
    playerPositionsArray.push(newPlayerPosition);
    playerAcceptablePositionsArray.push(newPlayerPosition);
    await changeClass("fade-out");
    await setTimeout(() => {
      setPlayerPosition(newPlayerPosition);
      changeClass("fade-in");
    }, 100);
  };

  const rotate = async (e, magnitude, pivotPointx, pivotPointy, direction) => { //direction: true = ccw, false = cw
    magnitude = Number(magnitude.slice(0, -1))
    pivotPointx = Number(pivotPointx)
    pivotPointy = Number(pivotPointy)
    let currentPlayerPosition = playerAcceptablePositionsArray[playerAcceptablePositionsArray.length-1]
    let newPlayerPosition = mathFunctions.rotate(currentPlayerPosition, magnitude, pivotPointx, pivotPointy, direction)
    playerPositionsArray.push(newPlayerPosition)
    playerAcceptablePositionsArray.push(newPlayerPosition)
    await changeClass("fade-out");
    await setTimeout(() => {
      setPlayerPosition(newPlayerPosition);
      changeClass("fade-in");
    }, 100);
  };
  // end of Shape Transformations--

  const moveBack_shakeVertical = async () => {
    playerAcceptablePositionsArray.pop();
    await setPlayerPosition(
      playerAcceptablePositionsArray[playerAcceptablePositionsArray.length - 1]
    );
    changeClass("shake-vertical");
  };

  const moveBack_shakeHorizontal = async () => {
    playerAcceptablePositionsArray.pop();
    await setPlayerPosition(
      playerAcceptablePositionsArray[playerAcceptablePositionsArray.length - 1]
    );
    changeClass("shake-horizontal");
  };

  const handleChange = e => {
    let name = e.target.name
    transformFunctions[name](e.target.value)
  };

  async function resetPlayer(userId, levelId, playerPosition, targetPosition) {
    setPlayerPosition(playerPositionsArray[0]);
    setPlayerPositionsArray(prev => [prev[0]]);
    setPlayerAcceptablePositionsArray(prev => [prev[0]]);
    clearStack();
    
    if (online) {
      const newAttemptId = await postAttempt(userId, levelId, playerPosition, targetPosition);
      setAttemptId(newAttemptId);
    }
  }

  const LevelCheck = (props) => {
    if (online) {
      props.postRun(props.callStackComps, props.attemptId, props.playerPositionsArray, props.playerAcceptablePositionsArray, props.score, true);
      props.endAttempt(props.attemptId);
    }
    function handleReset() {
      props.resetPlayer(props.userId, props.levelId, props.playerPositionsArray[0], props.targetPosition);
    }
    return (
      <div id="winner">
        <span>Portal Locked! <br />
        You Win</span>
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
    );
  };

  const shapeCompsObj = {
    circle: Circle,
    square: Square,
    triangle: Triangle,
    rectangle: Rectangle,
    star: Star
    // heart: Heart
  };
  const ShapeComp = shapeCompsObj[shape];
  const playerComp = (
    <ShapeComp
      moveBack_shakeVertical={moveBack_shakeVertical}
      moveBack_shakeHorizontal={moveBack_shakeHorizontal}
      shapeInfo={player}
      anchorDotSize={9}
    />
  );
  const targetComp = (
    <ShapeComp
      moveBack_shakeVertical={moveBack_shakeVertical}
      moveBack_shakeHorizontal={moveBack_shakeHorizontal}
      shapeInfo={target}
      anchorDotSize={9}
    />
  );

  // -- Stack Functions --
  function addToStack(image, desc, fx, para) {

    if (callStackComps.length < 10) {
      setCounter(prevCounter => prevCounter + 1)
      let newComp = 
      <CallCard
      image={image}
      fx={fx}
      para = {para}
      desc = {desc}
      id={counter}
      key={counter} />;
      setCallStackComps((prev) => [...prev, newComp])
    } else {
      alert("Too many actions in callstack. Consider removing some.")
    }
  }

  const runStack = async () => {
    
    if (online && callStackComps.length > 0) {
      await postRun(callStackComps, attemptId, playerPositionsArray, playerAcceptablePositionsArray, score, false);
    }

    // maybe try recursive function?
    const recursiveFunc = async (array) => {
      if (array.length > 0) {
        await array[0].props.fx(...array[0].props.para)
        let newArr = [...array]
        newArr.shift(0)
        setCallStackComps(newArr)
        setTimeout(() => {
          recursiveFunc(newArr)
        }, 1000)
      }
    }
    recursiveFunc(callStackComps)
  }

  function clearStack() {
    setCallStackComps([])
  }
  // --

  return (
    <main>
      {isSignedIn || 
        <Login
          setIsSignedIn = {setIsSignedIn}
          setUser = {setUser}
          setCurrentLevel = {setCurrentLevel}
          online = {online}
          setOnline = {setOnline}
        />
      }
      {isSignedIn && 
        <Menu
          setIsSignedIn = {setIsSignedIn}
          resetPlayer = {resetPlayer}
          endAttempt = {endAttempt}
          attemptId = {attemptId}
          setUser = {setUser}
          user = {user}
          online = {online}
          levelId = {currentLevel}
          playerPosition = {playerPositionsArray[0]}
          targetPosition = {targetPosition}
        />
      }
      <div className="canvasWrapper">
        <Grid />
        {targetComp}
        {playerComp}
      </div>
      <div className="controllerWrapper">
        <Sideboard
          translate={translate}
          rotate={rotate}
          reflect={reflect}
          handleChange={handleChange}
          translationFactor={translationFactor}
          pivotPointx={pivotPointx}
          pivotPointy={pivotPointy}
          rotationMag={rotationMag}
          lineOfReflection={lineOfReflection}
          addToStack={addToStack}
          key="sideboard"
        />
        <CallStack
          callStackComps={callStackComps}
          clearStack={clearStack}
          runStack = {runStack}
        />
      </div>
      {(JSON.stringify(playerPosition) === JSON.stringify(targetPosition)) &&
        <LevelCheck 
          resetPlayer={resetPlayer}
          postRun={postRun}
          endAttempt={endAttempt}
          attemptId={attemptId}
          callStackComps={callStackComps}
          playerPositionsArray={playerPositionsArray}
          playerAcceptablePositionsArray={playerAcceptablePositionsArray}
          score={score}
          userId={user.id}
          levelId={currentLevel}
          targetPosition={targetPosition}
        />
      }
    </main>
  );
}

function App() {
  return (
    <div className="App">
      <Game key="Game" />
    </div>
  );
}

export default App;
