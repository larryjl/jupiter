import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import SideboardComp from "./SideboardComp";

describe("sideboard load", () => {
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

  test("render", () => {
    act(() => {
      render(<SideboardComp />, container);
    });
  });
})

describe("sideboard tab clicks", () => {
  let container = null;
  let translate, rotate, reflect, handleChange, translationFactor, pivotPointx, pivotPointy, rotationMag, lineOfReflection;
  let translationBtn, reflectionBtn, rotationBtn;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);

    act(() => {
      render(
        <SideboardComp
        translate={translate}
        rotate={rotate}
        reflect={reflect}
        handleChange={handleChange}
        translationFactor={translationFactor}
        pivotPointx={pivotPointx}
        pivotPointy={pivotPointy}
        rotationMag ={rotationMag}
        lineOfReflection={lineOfReflection}
        />,
        container
      );
    });
    translationBtn = document.getElementById("translation-button");
    rotationBtn = document.getElementById("rotation-button");
    reflectionBtn = document.getElementById("reflection-button");
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  test("click translation", () => {
    // click translation
    act(() => {
      translationBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  test("click rotation", () => {
    // click rotation
    act(() => {
      rotationBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  test("click reflection", () => {
    // click reflection
    act(() => {
      reflectionBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });
});
