import mathFunctions from './math'

test('math grid', () => {
    const grid = mathFunctions.createGridObject();
    expect(grid[-5][5]).toEqual(false);
    expect(grid[-11]).toEqual(undefined);
    expect(grid[0][-11]).toEqual(undefined);
    expect(Object.values(grid).length).toBe(21);
});

test('math translate', () => {
    expect(mathFunctions.translate(-5, 5, 2, 2)).toEqual([-3, 7])
});

test('math reflect', () => {
    expect(mathFunctions.reflect([1000, 1000, 2, 1],[true, false, 0])).toEqual([1000, 1000, -1]);
    expect(mathFunctions.reflect([1000, 1000, 2, 1],[false, true, 0])).toEqual([1000, 1000, -3]);
    expect(mathFunctions.reflect([600, 1000, 2, -3],[true, false, -2])).toEqual([1000, 1000, 3]);
    expect(mathFunctions.reflect([1000, 1200, 2, -4],[false, true, -3])).toEqual([1000, 1400, 2]);
});

test('math rotate', () => {
    expect(mathFunctions.rotate(90, true, [0,0], [1300,800,2,1])).toEqual([800, 700, 2]);
    expect(mathFunctions.rotate(270, true, [0,0], [1300,800,2,-1])).toEqual([1200, 1300, -2]);
    expect(mathFunctions.rotate(270, true, [0,0], [1300,800,2,4])).toEqual([1200, 1300, 3]);
    expect(mathFunctions.rotate(270, true, [0,0], [1300,800,2,-4])).toEqual([1200, 1300, -1]);
    expect(mathFunctions.rotate(90, false, [0,0], [1300,800,2,1])).toEqual([1200, 1300, 4]);
    expect(mathFunctions.rotate(270, false, [0,0], [1300,800,2,-1])).toEqual([800, 700, -4]);
    expect(mathFunctions.rotate(270, false, [0,0], [1300,800,2,4])).toEqual([800, 700, 1]);
    expect(mathFunctions.rotate(270, false, [0,0], [1300,800,2,-4])).toEqual([800, 700, -3]);
    expect(mathFunctions.rotate(270, true, [5, -5], [1900, 900, 2, 1])).toEqual([2100, 1900, 4])
    expect(mathFunctions.rotate(90, false, [0, 0], [300, 1700, 2, 4])).toEqual([1700, 1700, 1])
    expect(mathFunctions.rotate(90, false, [0, 0], [1700, 1700, 2, 1])).toEqual([1700, 300, 2])

});

test('grid transform', () => {
    const grid = mathFunctions.createGridObject();
    mathFunctions.transformGrid(grid, -5, 5, mathFunctions.translate, [2, 2]);
    expect(grid[-3][7]).toEqual(true);
    expect(grid[-5][5]).toEqual(false);
});