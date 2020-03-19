import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import App from "./App";

describe("app integration", () => {
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

  test("render app", () => {
    act(() => {
      render(<App />, container);
    });
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  test("integration with sideboard click", () => {
    const mockButtonFx = jest.fn(); // mock function
    act(() => {
      render(<App />, container);
    });
    // identify the buttons
    const translationBtn = document.getElementById("translation-button");
    const rotationBtn = document.getElementById("rotation-button");
    const reflectionBtn = document.getElementById("reflection-button");

    // translation
    act(() => {
      translationBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // translation buttons
    const up = document.getElementById("up");
    const down = document.getElementById("down");
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    // click up
    act(() => {
      up.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // click down
    act(() => {
      down.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // click left
    act(() => {
      left.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // click right
    act(() => {
      right.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(pretty(container.innerHTML)).toMatchSnapshot();

    // rotation
    act(() => {
      rotationBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const rotateDrop = document.getElementById("rotateDrop");
    const angles = ["90°", "180°", "270°"];
    for (const angleStr of angles) {
      act(() => {
        rotateDrop.value = angleStr;
      });
      expect(rotateDrop.value).toBe(angleStr);
    }
    expect(pretty(container.innerHTML)).toMatchSnapshot();

    // reflection
    act(() => {
      reflectionBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const reflectDrop = document.getElementById("reflectDrop");
    for (let i = -9; i <= 9; i++) {
      act(() => {
        reflectDrop.value = i;
      });
      expect(reflectDrop.value).toBe(i.toString());
    }
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });
});
