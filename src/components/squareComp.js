import React, { useEffect } from 'react';
import './circleComp.css';

function Square(props) {
    console.log('square')
    // postion is array of anchorX, anchorY, length
    let {id, position, fillColour, borderColour, borderWidth, shapeClassName, orientation} = props.shapeInfo //props.circleInfo -> props.shapeInfo
    useEffect(() => {
        var canvas = document.getElementById(id);
        var context = canvas.getContext("2d");
        canvas.width = 2000;
        canvas.height = 2000;

        let cornerArray = determineCorners(position[0], position[1], position[2], orientation);
        console.log(position, 'ue')

        function drawSquare( fillColour, borderColour, borderWidth) {
            console.log('ssss')
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.beginPath();
            context.moveTo(cornerArray[0][0], cornerArray[0][1]);
            context.lineTo(cornerArray[1][0], cornerArray[1][1]);
            context.lineTo(cornerArray[2][0], cornerArray[2][1]);
            context.lineTo(cornerArray[3][0], cornerArray[3][1]);
            context.fill();
            context.fillStyle = fillColour;
            
            context.lineWidth = borderWidth;
            context.strokeStyle = borderColour;
            context.stroke();
        }
            
        drawSquare(fillColour, borderColour, borderWidth); 

    }, [position[0], position[1]]);
    
    return (
      <div className={shapeClassName}>
          <canvas id={id}></canvas>
      </div>
    );
}

function determineCorners (anchorX, anchorY, length, orientation) {
    if (orientation === 1) {
        return  [[anchorX, anchorY],[anchorX + length, anchorY],[anchorX+length, anchorY-length],[anchorX, anchorY-length]];
    }
    if (orientation === 2) {
        return  [[anchorX, anchorY],[anchorX + length, anchorY],[anchorX+length, anchorY+length],[anchorX, anchorY+length]];
    }
    if (orientation === 3) {
        return  [[anchorX, anchorY],[anchorX - length, anchorY],[anchorX-length, anchorY+length],[anchorX, anchorY+length]];
    }
    if (orientation === 4) {
        return [[anchorX, anchorY],[anchorX - length, anchorY],[anchorX-length, anchorY-length],[anchorX, anchorY-length]];
    }
}



export {Square, determineCorners}