
const shapesFunctions = {
    drawAnchorDot: (context, centerX, centerY, radius, fillColour, borderColour, borderWidth) => {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = fillColour;
        context.fill();
        context.lineWidth = borderWidth;
        context.strokeStyle = borderColour;
        context.stroke();
    },
    determineCorners : (anchorX, anchorY, length, orientation, orientation1) => {
        if (orientation === 1) {
          return orientation1;
        }
        if (orientation === 2) {
          let helper = shapesFunctions.determineCorners(anchorX, anchorY, length, 1, orientation1);
          for (let corner of helper) {
            let cornerX = corner[0];
            let cornerY = corner[1];
            corner[0] = anchorX + cornerY - anchorY;
            corner[1] = anchorY - cornerX + anchorX;
          }
          return helper;
        }
      
        if (orientation === 3) {
          let helper = shapesFunctions.determineCorners(anchorX, anchorY, length, 1, orientation1);
          for (let corner of helper) {
            let cornerX = corner[0];
            let cornerY = corner[1];
            corner[0] = 2 * anchorX - cornerX;
            corner[1] = 2 * anchorY - cornerY;
          }
          return helper;
        }
        if (orientation === 4) {
          let helper = shapesFunctions.determineCorners(anchorX, anchorY, length, 1, orientation1);
          for (let corner of helper) {
            let cornerX = corner[0];
            let cornerY = corner[1];
            corner[0] = anchorY - cornerY + anchorX;
            corner[1] = cornerX - anchorX + anchorY;
          }
          return helper;
        }
        if (orientation === (-1)) {
          let helper = shapesFunctions.determineCorners(anchorX, anchorY, length, 1, orientation1);
          for (let corner of helper) {
            corner[0] = corner[0] - 2*(corner[0]-anchorX)
          }
          return helper;
        }
        if (orientation === (-2)) {
          let helper = shapesFunctions.determineCorners(anchorX, anchorY, length, 2, orientation1);
          for (let corner of helper) {
            corner[0] = corner[0] - 2*(corner[0]-anchorX)
          }
          return helper;
        }
        if (orientation === (-3)) {
          let helper = shapesFunctions.determineCorners(anchorX, anchorY, length, 3, orientation1);
          for (let corner of helper) {
            corner[0] = corner[0] - 2*(corner[0]-anchorX)
          }
          return helper;
        }
        if (orientation === (-4)) {
          let helper = shapesFunctions.determineCorners(anchorX, anchorY, length, 4, orientation1);
          for (let corner of helper) {
            corner[0] = corner[0] - 2*(corner[0]-anchorX)
          }
          return helper;
        }
    }
}


export default shapesFunctions;