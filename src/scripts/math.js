
const mathFunctions = {
    shapeMaker: (size) => {
        let anchorX = 0
        while(anchorX < size || anchorX > 2000-size ) {
            anchorX = (Math.floor(Math.random()*19)+1)*100
        }
        let anchorY = 0
        while(anchorY < size || anchorY > 2000-size ) {
            anchorY = (Math.floor(Math.random()*19)+1)*100
        }
        return [anchorX, anchorY]
    },

    translate: (playerPosition, deltaX, deltaY) => {
        let [anchorX, anchorY, size , orientation] = playerPosition;
        anchorX = anchorX + deltaX;
        anchorY = anchorY + deltaY;
        return ([anchorX, anchorY, size , orientation]);
    },

    reflect: (playerPosition, lineOfReflection, axis) => { // axis: x = true, y = false
        let [anchorX, anchorY, size , orientation] = playerPosition;
        if (axis) {
            lineOfReflection = lineOfReflection*100 + 1000;
            anchorX = anchorX - 2*(anchorX-lineOfReflection)
            orientation = orientation * -1;
        }
        if (!axis) {
            lineOfReflection = -lineOfReflection*100 + 1000;
            anchorY = anchorY - 2*(anchorY-lineOfReflection);
            if (orientation > 0) {
                orientation = orientation + 2;
                if (orientation > 4) orientation = orientation - 4
            } 
            if (orientation < 0) {
                orientation = orientation + 2;
                if (orientation >= 0) orientation = orientation - 4
            }
            orientation = orientation * -1;
        }
        return ([anchorX, anchorY, size, orientation])
    },

    rotate: (playerPosition, magnitude, pivotPointx, pivotPointy, direction) => { //direction: true = ccw, false = cw
        let [anchorX, anchorY, size, orientation] = playerPosition;
        pivotPointx = pivotPointx*100 + 1000;
        pivotPointy = -pivotPointy*100 + 1000;
        if ((magnitude === 90 && direction)||(magnitude === 270 && !direction)) {
            let cornerX = anchorX;
            let cornerY = anchorY;
            anchorX = pivotPointx + cornerY - pivotPointy;
            anchorY = pivotPointy - cornerX + pivotPointx;
            if (orientation > 0) {
                orientation = orientation + 1;
                if (orientation > 4) orientation = orientation - 4
            } 
            if (orientation < 0) {
                orientation = orientation + 1;
                if (orientation >= 0) orientation = orientation - 4
            }
        }
        if ((magnitude === 180 && direction)||(magnitude === 180 && !direction)) {
            let cornerX = anchorX;
            let cornerY = anchorY;
            anchorX = 2 * pivotPointx - cornerX;
            anchorY = 2 * pivotPointy - cornerY;
            if (orientation > 0) {
                orientation = orientation + 2;
                if (orientation > 4) orientation = orientation - 4
            } 
            if (orientation < 0) {
                orientation = orientation + 2;
                if (orientation >= 0) orientation = orientation - 4
            }
        }
        if ((magnitude === 270 && direction)||(magnitude === 90 && !direction)) {
            let cornerX = anchorX;
            let cornerY = anchorY;
            anchorX = pivotPointy - cornerY + pivotPointx;
            anchorY = cornerX - pivotPointx + pivotPointy;
            if (orientation > 0) {
                orientation = orientation + 3;
                if (orientation > 4) orientation = orientation - 4
            } 
            if (orientation < 0) {
                orientation = orientation + 3;
                if (orientation >= 0) orientation = orientation - 4
            }
        }
        return ([anchorX, anchorY, size, orientation])
    },
}


export default mathFunctions;