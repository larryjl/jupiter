import React, { useEffect } from 'react';
import './shapeComp.css';

function Heart(props) {
    // postion is array of anchorX, anchorY, length
    let {id, position, fillColour, borderColour, borderWidth, shapeClassName} = props.shapeInfo //props.circleInfo -> props.shapeInfo
    let [anchorX, anchorY, size, orientaion] = position
    size = 400;


    useEffect(() => {
        const canvas = document.getElementById(id);
        const context = canvas.getContext("2d");
        canvas.width = 2000;
        canvas.height = 2000;

        let cornerArray = determineCorners(anchorX, anchorY-200, 1);
    function drawHeart(cornerArray, fillColour, borderColour, borderWidth) {

        const width = 300 ;
        const height = 400;
    
        context.save();
        context.beginPath();
        const topCurveHeight = height * 0.3;
        context.moveTo(cornerArray[0], cornerArray[4]);
        // top left curve
        context.bezierCurveTo(
        cornerArray[0], cornerArray[3], 
        cornerArray[1], cornerArray[3], 
        cornerArray[1], cornerArray[4]
        );
    
        // bottom left curve
        context.bezierCurveTo(
            cornerArray[1], cornerArray[5], 
        cornerArray[0], cornerArray[5], 
        cornerArray[0], cornerArray[6]
        );

        // bottom right curve
    context.bezierCurveTo(
        cornerArray[0], cornerArray[5], 
        cornerArray[2], cornerArray[5], 
        cornerArray[2], cornerArray[4]
    );

    // top right curve
    context.bezierCurveTo(
        cornerArray[2], cornerArray[3], 
        cornerArray[0], cornerArray[3], 
        cornerArray[0], cornerArray[4]
    );

    context.closePath();
    context.fillStyle = fillColour;
    context.fill();
    context.restore();

    }
            
        drawHeart(cornerArray, fillColour, borderColour, borderWidth); 

    }, [anchorX, anchorY, size, orientaion]);

    
    return (
      <div className={shapeClassName}>
          <canvas id={id}></canvas>
      </div>
    );
}

function determineCorners (anchorX, anchorY, orientation) {
    let width = 300 ;
    let height = 400;
    let tCH = height * 0.3; //topCurveHeight

    if (orientation === 1) {
        return  [anchorX, anchorX-width/2, anchorX + width/2, anchorY, anchorY + tCH, anchorY + (height + tCH)/2, anchorY + height ];
    }
    if (orientation === 2) {
        return  [anchorY, anchorY-width/2, anchorY + width/2, anchorX, anchorX + tCH, anchorX + (height + tCH)/2, anchorX + height];
    }
//     if (orientation === 3) {
//         return  [[anchorX, anchorY],[anchorX - length, anchorY],[anchorX-length, anchorY+length],[anchorX, anchorY+length]];
//     }
//     if (orientation  === 4) {
//         return [[anchorX, anchorY],[anchorX - length, anchorY],[anchorX-length, anchorY-length],[anchorX, anchorY-length]];
//     }
}



export {Heart}