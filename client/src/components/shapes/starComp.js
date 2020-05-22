import React, { useEffect } from "react";
import "./shapeComp.css";
import shapesFunctions from "./shapesFunctions.js";

function Star(props) {
  let {
    id,
    position,
    fillColour,
    borderColour,
    borderWidth,
    shapeClassName
  } = props.shapeInfo;
  let [anchorX, anchorY, size, orientation] = position;
  let anchorDotSize = props.anchorDotSize;
  
  let orientation1 = [
    [anchorX, anchorY],
    [anchorX + (size/525)*175, anchorY - (size/525)*125],
    [anchorX + (size/525)*375, anchorY],
    [anchorX + (size/525)*300, anchorY - (size/525)*200],
    [anchorX + (size/525)*425, anchorY - (size/525)*350],
    [anchorX + (size/525)*250, anchorY - (size/525)*350],
    [anchorX + (size/525)*175, anchorY - (size/525)*525],
    [anchorX + (size/525)*100, anchorY - (size/525)*350],
    [anchorX - (size/525)*75, anchorY - (size/525)*350],
    [anchorX + (size/525)*50, anchorY - (size/525)*200]
  ]

  let cornerArray = shapesFunctions.determineCorners(
    anchorX,
    anchorY,
    size,
    orientation,
    orientation1
  );

  for (let corner of cornerArray) {
    if (corner[1] < 0 || corner[1] > 2000) {
        props.moveBack_shakeVertical();
        break;
    } else if (corner[0] < 0 || corner[0] > 2000) {
        props.moveBack_shakeHorizontal();
        break;
    }
  }

  useEffect(() => {
    const canvas = document.getElementById(id);
    const context = canvas.getContext("2d");
    canvas.width = 2000;
    canvas.height = 2000;


    function drawStar(fillColour, borderColour, borderWidth) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.moveTo(cornerArray[0][0], cornerArray[0][1]);
      context.lineTo(cornerArray[1][0], cornerArray[1][1]);
      context.lineTo(cornerArray[2][0], cornerArray[2][1]);
      context.lineTo(cornerArray[3][0], cornerArray[3][1]);
      context.lineTo(cornerArray[4][0], cornerArray[4][1]);
      context.lineTo(cornerArray[5][0], cornerArray[5][1]);
      context.lineTo(cornerArray[6][0], cornerArray[6][1]);
      context.lineTo(cornerArray[7][0], cornerArray[7][1]);
      context.lineTo(cornerArray[8][0], cornerArray[8][1]);
      context.lineTo(cornerArray[9][0], cornerArray[9][1]);
      context.lineTo(cornerArray[0][0], cornerArray[0][1]);

      context.fillStyle = fillColour;
      context.fill();
      context.lineWidth = borderWidth;
      context.strokeStyle = borderColour;
      context.stroke();
    }
    
    drawStar(fillColour, borderColour, borderWidth);
    if (anchorDotSize) {
      shapesFunctions.drawAnchorDot(context, cornerArray[0][0], cornerArray[0][1], anchorDotSize, 'white', 'white', borderWidth);
      shapesFunctions.drawAnchorDot(context, cornerArray[2][0], cornerArray[2][1], anchorDotSize, 'black', 'black', borderWidth);
  }
  }, [position]);

  return (
    <div className={shapeClassName}>
      <canvas id={id}></canvas>
    </div>
  );
}

export { Star };
