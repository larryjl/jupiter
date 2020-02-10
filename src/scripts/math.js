// generate grid with a loop
const mathFunctions = {
    shapeMaker: (shapeType, size) => {
        if (shapeType === 'circle') {
            let radius = size
            let centerX = 0
            while(centerX < radius || centerX > 2000-radius ) {
                centerX = (Math.floor(Math.random()*(10)))*200
            }
            let centerY = 0
            while(centerY < radius || centerY > 2000-radius ) {
                centerY = (Math.floor(Math.random()*(10)))*200
            }
            return [centerX, centerY, radius]
        }
    },

    createGridObject: () => {
        const grid ={};
        for (let x = -10; x <= 10; x++) {
            grid[x] = {};
            for (let y = -10; y <= 10; y++) {
                grid[x][y] = false;
            }
        }
    return grid
    },

    translate: (x, y, deltaX, deltaY) => {
        let endX = x + deltaX;
        let endY = y + deltaY;
        return [endX, endY]
    },

    reflect: (x, y, horizontal, axis) => {
        let endX = x;
        let endY = y;
        if (horizontal) {
            endX = axis + (axis - x);
        } else {
            endY = axis + (axis - y);
        };
        return [endX, endY];
    },

    // rotate: (x,y, clockwise, centre) => {
    //     let endX;
    //     let endY;
    //     return [endX, endY];
    // },

    transformGrid: (grid, x, y, callback, parameters) => {
        let [endX, endY] = callback(x, y, ...parameters);
        grid[endX][endY] = true;
        grid[x][y] = false;
    }
}


export default mathFunctions;