import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Star, determineCorners } from "./starComp.js";


describe("star load", () => {
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
  test("load", () => {
    const moveBack_shakeVertical = jest.fn();
    const moveBack_shakeHorizontal = jest.fn();
    let shapeInfo = {
      id: "star",
      position: [0, 0, 100, 1],
      fillColour: "rgba(255, 77, 0, 1)",
      borderColour: "rgba(255, 255, 255, 1)",
      borderWidth: 10,
      shapeClassName: ""
    };
    render(
      <Star 
        shapeInfo={shapeInfo} 
        moveBack_shakeVertical={moveBack_shakeVertical}
        moveBack_shakeHorizontal={moveBack_shakeHorizontal}
      />, container);
  });
});
