import React, { useEffect } from 'react';
import './shapeComp.css';
import shapesFunctions from "./shapesFunctions.js";

function Square(props) {
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
        [anchorX + size, anchorY],
        [anchorX + size, anchorY - size],
        [anchorX, anchorY - size]
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

        function drawSquare(fillColour, borderColour, borderWidth) {
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.beginPath();
            context.moveTo(cornerArray[0][0], cornerArray[0][1]);
            context.lineTo(cornerArray[1][0], cornerArray[1][1]);
            context.lineTo(cornerArray[2][0], cornerArray[2][1]);
            context.lineTo(cornerArray[3][0], cornerArray[3][1]);
            context.lineTo(cornerArray[0][0], cornerArray[0][1]);
            context.fillStyle = fillColour;
            context.fill();
            context.lineWidth = borderWidth;
            context.strokeStyle = borderColour;
            context.stroke();
        }

        drawSquare(fillColour, borderColour, borderWidth);
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

export { Square }