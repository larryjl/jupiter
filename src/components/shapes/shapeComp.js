import React, { useEffect, useRef } from "react";
import "./shapeComp.css";

function determineCorners(x, y, size, orientation, shape) {
  let [d1, d2] = size;
  const corners = {
    circle: {
      0: [[x, y]]
    },
    square: {
      1: [
        [x, y],
        [x + d1, y],
        [x + d1, y - d1],
        [x, y - d1]
      ],
      2: [
        [x, y],
        [x + d1, y],
        [x + d1, y + d1],
        [x, y + d1]
      ],
      3: [
        [x, y],
        [x - d1, y],
        [x - d1, y + d1],
        [x, y + d1]
      ],
      4: [
        [x, y],
        [x - d1, y],
        [x - d1, y - d1],
        [x, y - d1]
      ]
    },
    triangle: {
      1: [
        [x, y],
        [x + d1, y],
        [x, y - d2]
      ],
      2: [
        [x, y],
        [x + d1, y],
        [x, y + d2]
      ],
      3: [
        [x, y],
        [x - d1, y],
        [x, y + d2]
      ],
      4: [
        [x, y],
        [x - d1, y],
        [x, y - d2]
      ],
      5: [
        [x, y],
        [x + d2, y],
        [x, y + d1]
      ],
      6: [
        [x, y],
        [x - d2, y],
        [x, y - d1]
      ]
    },
    star: {
      1: [
        [x, y],
        [x + 175, y - 125],
        [x + 375, y],
        [x + 300, y - 200],
        [x + 425, y - 350],
        [x + 250, y - 350],
        [x + 175, y - 525],
        [x + 100, y - 350],
        [x - 75, y - 350],
        [x + 50, y - 200]
      ],
      2: [
        [x, y],
        [x + 125, y + 175],
        [x, y + 375],
        [x + 200, y + 300],
        [x + 350, y + 425],
        [x + 350, y + 250],
        [x + 525, y + 175],
        [x + 350, y + 100],
        [x + 350, y - 75],
        [x + 200, y + 50]
      ],
      3: [
        [x, y],
        [x - 175, y + 125],
        [x - 375, y],
        [x - 300, y + 200],
        [x - 425, y + 350],
        [x - 250, y + 350],
        [x - 175, y + 525],
        [x - 100, y + 350],
        [x + 75, y + 350],
        [x - 50, y + 200]
      ],
      4: [
        [x, y],
        [x - 125, y - 175],
        [x, y - 375],
        [x - 200, y - 300],
        [x - 350, y - 425],
        [x - 350, y - 250],
        [x - 525, y - 175],
        [x - 350, y - 100],
        [x - 350, y + 75],
        [x - 200, y - 50]
      ]
    }
  };
  return corners[shape][orientation];
}

function draw(
  id,
  width,
  height,
  shape,
  corners,
  fillColour,
  borderColour,
  borderWidth,
  radius
) {
  const canvas = document.getElementById(id);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  let pointCount = 0;
  switch (shape) {
    case "circle":
      ctx.arc(corners[0][0], corners[0][1], radius, 0, 2 * Math.PI, false);
      break;
    default:
      for (const point of corners) {
        if (pointCount++ === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      }
  }
  ctx.fillStyle = fillColour;
  ctx.fill();
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = borderColour;
  ctx.stroke();
  return ctx;
}

function checkBounds(
  points,
  width,
  height,
  horizontalCall,
  verticalCall,
  radius = 0
) {
  for (const point of points) {
    if (point[0] < radius || point[0] > width - radius) {
      horizontalCall();
      break;
    }
    if (point[1] < radius || point[1] > height - radius) {
      verticalCall();
      break;
    }
  }
}

function Shape(props) {
  const width = 2000,
    height = 2000;
  const {
    id,
    position,
    shapeClassName,
    fillColour,
    borderColour,
    borderWidth
  } = props.shapeInfo;
  position[4] = props.shape; // todo: add shape to position prop
  const [x, y, size, orientation, shape] = position;
  const radius = shape === "circle" ? size / 2 : undefined;
  const corners = determineCorners(...position);
  checkBounds(
    corners,
    width,
    height,
    props.moveBack_shakeHorizontal,
    props.moveBack_shakeVertical,
    radius
  );

  useEffect(() => {
    draw(
      id,
      width,
      height,
      shape,
      corners,
      fillColour,
      borderColour,
      borderWidth,
      radius
    );
  }, [
    position,
    id,
    width,
    height,
    shape,
    corners,
    fillColour,
    borderColour,
    borderWidth,
    radius
  ]);

  return (
    <div className={shapeClassName}>
      <canvas id={id}></canvas>
    </div>
  );
}

export { determineCorners, draw, checkBounds };
export default Shape;
