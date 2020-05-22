import React, { useEffect } from 'react';
import './shapeComp.css';
import shapesFunctions from "./shapesFunctions.js";

function Circle(props) {
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
    let radius = size/2;

    let orientation1 = [[anchorX+radius, anchorY], [anchorX, anchorY+radius]];
    
    let cornerArray = shapesFunctions.determineCorners(
    anchorX,
    anchorY,
    radius,
    orientation,
    orientation1
    );
    
    if (anchorY < radius || anchorY > 2000-radius) {
        props.moveBack_shakeVertical();
    } else if (anchorX < radius || anchorX > 2000-radius) {
        props.moveBack_shakeHorizontal();
    }

    useEffect(() => {
        const canvas = document.getElementById(id);
        const context = canvas.getContext("2d");
        canvas.width = 2000;
        canvas.height = 2000;

        function drawCircle(centerX, centerY, radius, fillColour, borderColour, borderWidth) {
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = fillColour;
            context.fill();
            context.lineWidth = borderWidth;
            context.strokeStyle = borderColour;
            context.stroke();
        }

        drawCircle(anchorX, anchorY, radius, fillColour, borderColour, borderWidth);
        if (anchorDotSize) {
            shapesFunctions.drawAnchorDot(context, cornerArray[0][0], cornerArray[0][1], anchorDotSize, 'white', 'white', borderWidth);
            shapesFunctions.drawAnchorDot(context, cornerArray[1][0], cornerArray[1][1], anchorDotSize, 'black', 'black', borderWidth);
        } 
    }, [position]);

    return (
        <div className={shapeClassName}>
            <canvas id={id}></canvas>
        </div>
    );
}

export { Circle }