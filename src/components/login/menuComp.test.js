import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Menu from "./menuComp";


describe("render", () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    // mock google api
    global.gapi = {
      load: jest.fn(),
      auth2: {
        init: jest.fn()
      }
    }
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  test("render", () => {
    act(() => {
      render(<Menu />, container);
    });
    // expect(pretty(container.innerHTML)).toMatchSnapshot();
  });
});