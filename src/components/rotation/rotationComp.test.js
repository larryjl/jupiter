import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Rotation from "./rotationComp";

describe("component", () => {
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
      render(<Rotation />, container);
    });
  });

  test("change dropdown", () => {
    // setup mock button function
    // const mockDropdownFx = jest.fn(); // mock function
    act(() => {
      render(
        <Rotation
        // buttonFunction={mockButtonFx}
        />,
        container
      );
    });
    const rotateDrop = document.getElementById("rotateDrop");
    const angles = ["90°", "180°", "270°"];
    expect(rotateDrop.value).toBe("90°");
    for (const angleStr of angles) {
      act(() => {
        rotateDrop.value = angleStr;
      });
      expect(rotateDrop.value).toBe(angleStr);
    }
  });
});
