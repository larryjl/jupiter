import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { determineCorners, draw, checkBounds } from "./shapeComp";
import Shape from "./shapeComp";

describe("determine corners", () => {
  test("circle 0", () => {
    expect(determineCorners(1000, 1000, [200], 0, "circle")).toEqual([
      [1000, 1000]
    ]);
  });
  test("square 1", () => {
    expect(determineCorners(1000, 1000, [200], 1, "square")).toEqual([
      [1000, 1000],
      [1200, 1000],
      [1200, 800],
      [1000, 800]
    ]);
  });
  test("square 2", () => {
    expect(determineCorners(1000, 1000, [200], 2, "square")).toEqual([
      [1000, 1000],
      [1200, 1000],
      [1200, 1200],
      [1000, 1200]
    ]);
  });
  test("square 3", () => {
    expect(determineCorners(1000, 1000, [200], 3, "square")).toEqual([
      [1000, 1000],
      [800, 1000],
      [800, 1200],
      [1000, 1200]
    ]);
  });
  test("square 4", () => {
    expect(determineCorners(1000, 1000, [200], 4, "square")).toEqual([
      [1000, 1000],
      [800, 1000],
      [800, 800],
      [1000, 800]
    ]);
  });
  test("triangle 1", () => {
    expect(determineCorners(1000, 1000, [200, 300], 1, "triangle")).toEqual([
      [1000, 1000],
      [1200, 1000],
      [1000, 700]
    ]);
  });
  test("triangle 2", () => {
    expect(determineCorners(1000, 1000, [200, 300], 2, "triangle")).toEqual([
      [1000, 1000],
      [1200, 1000],
      [1000, 1300]
    ]);
  });
  test("triangle 3", () => {
    expect(determineCorners(1000, 1000, [200, 300], 3, "triangle")).toEqual([
      [1000, 1000],
      [800, 1000],
      [1000, 1300]
    ]);
  });
  test("triangle 4", () => {
    expect(determineCorners(1000, 1000, [200, 300], 4, "triangle")).toEqual([
      [1000, 1000],
      [800, 1000],
      [1000, 700]
    ]);
  });
  test("triangle 5", () => {
    expect(determineCorners(1000, 1000, [200, 300], 5, "triangle")).toEqual([
      [1000, 1000],
      [1300, 1000],
      [1000, 1200]
    ]);
  });
  test("triangle 6", () => {
    expect(determineCorners(1000, 1000, [200, 300], 6, "triangle")).toEqual([
      [1000, 1000],
      [700, 1000],
      [1000, 800]
    ]);
  });
  test("star 1", () => {
    expect(determineCorners(1000, 1000, [200], 1, "star")).toEqual([
      [1000, 1000],
      [1175, 875],
      [1375, 1000],
      [1300, 800],
      [1425, 650],
      [1250, 650],
      [1175, 475],
      [1100, 650],
      [925, 650],
      [1050, 800]
    ]);
  });
  test("star 2", () => {
    expect(determineCorners(1000, 1000, [200], 2, "star")).toEqual([
      [1000, 1000],
      [1125, 1175],
      [1000, 1375],
      [1200, 1300],
      [1350, 1425],
      [1350, 1250],
      [1525, 1175],
      [1350, 1100],
      [1350, 925],
      [1200, 1050]
    ]);
  });
  test("star 3", () => {
    expect(determineCorners(1000, 1000, [200], 3, "star")).toEqual([
      [1000, 1000],
      [825, 1125],
      [625, 1000],
      [700, 1200],
      [575, 1350],
      [750, 1350],
      [825, 1525],
      [900, 1350],
      [1075, 1350],
      [950, 1200]
    ]);
  });
  test("star 4", () => {
    expect(determineCorners(1000, 1000, [200], 4, "star")).toEqual([
      [1000, 1000],
      [875, 825],
      [1000, 625],
      [800, 700],
      [650, 575],
      [650, 750],
      [475, 825],
      [650, 900],
      [650, 1075],
      [800, 950]
    ]);
  });
});
describe("checkbounds", () => {
  test("square y out", () => {
    let points = [
        [0, 2001],
        [2000, 2001],
        [2000, 2000],
        [0, 2000]
      ],
      width = 2000,
      height = 2000,
      horizontalCall = jest.fn(),
      verticalCall = jest.fn();
    checkBounds(points, width, height, horizontalCall, verticalCall);
    expect(horizontalCall.mock.calls.length).toBe(0);
    expect(verticalCall.mock.calls.length).toBe(1);
  });
  test("square x out", () => {
    let points = [
        [-1, 0],
        [2000, 0],
        [2000, 2000],
        [-1, 2000]
      ],
      width = 2000,
      height = 2000,
      horizontalCall = jest.fn(),
      verticalCall = jest.fn();
    checkBounds(points, width, height, horizontalCall, verticalCall);
    expect(horizontalCall.mock.calls.length).toBe(1);
    expect(verticalCall.mock.calls.length).toBe(0);
  });
  test("circle y out", () => {
    let points = [[1000, 1900]],
      width = 2000,
      height = 2000,
      horizontalCall = jest.fn(),
      verticalCall = jest.fn(),
      radius = 200;
    checkBounds(points, width, height, horizontalCall, verticalCall, radius);
    expect(horizontalCall.mock.calls.length).toBe(0);
    expect(verticalCall.mock.calls.length).toBe(1);
  });
  test("circle out", () => {
    let points = [[-100, 1000]],
      width = 2000,
      height = 2000,
      horizontalCall = jest.fn(),
      verticalCall = jest.fn(),
      radius = 200;
    checkBounds(points, width, height, horizontalCall, verticalCall, radius);
    expect(horizontalCall.mock.calls.length).toBe(1);
    expect(verticalCall.mock.calls.length).toBe(0);
  });
});
describe("container", () => {
  let container = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });
  test("draw", () => {
    let id = 1,
      width = 2000,
      height = 2000,
      shape = "square",
      corners = [
        [1000, 1000],
        [1200, 1000],
        [1200, 800],
        [1000, 800]
      ];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", id);
    container.appendChild(canvas);
    const context = draw(id, width, height, shape, corners);
    const events = context.__getEvents();
    const path = context.__getPath();
    const drawCalls = context.__getDrawCalls();
    expect(events).toMatchSnapshot();
    expect(path).toMatchSnapshot();
    expect(drawCalls).toMatchSnapshot();
  });
  test("render", () => {
    const moveBack_shakeHorizontal = jest.fn();
    const moveBack_shakeVertical = jest.fn();
    let shapeInfo = {
      id: 1,
      position: [0, 0, [100], 1],
      fillColour: "rgba(255, 77, 0, 1)",
      borderColour: "rgba(255, 255, 255, 1)",
      borderWidth: 10,
      shapeClassName: "square"
    };
    act(() => {
      render(
        <Shape
          shape={"square"}
          shapeInfo={shapeInfo}
          moveBack_shakeHorizontal={moveBack_shakeHorizontal}
          moveBack_shakeVertical={moveBack_shakeVertical}
        />,
        container
      );
    });
  });
});
