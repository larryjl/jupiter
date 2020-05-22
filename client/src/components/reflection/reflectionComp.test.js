import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Reflection from "./reflectionComp";

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
      render(<Reflection />, container);
    });
  });

  test("change dropdown", () => {
    // setup mock button function
    // const mockDropdownFx = jest.fn(); // mock function
    act(() => {
      render(
        <Reflection
        // buttonFunction={mockButtonFx}
        />,
        container
      );
    });
    const reflectDrop = document.getElementById("reflectDrop");
    for (let i = -9; i <= 9; i++) {
      act(() => {
        reflectDrop.value = i;
      });
      expect(reflectDrop.value).toBe(i.toString());
    }
  });
});
