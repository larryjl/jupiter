import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import SideboardComp from './SideboardComp';

describe('sideboard load', () => {

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

  test('click button', () => {
    // setup mock button function
    const mockFx = jest.fn(); // mock function
    act(() => {
      render(
        <SideboardComp
          buttonFunction={mockFx}
        />, container
      );
    });
    // identify the buttons
    const up = document.getElementById("up");
    const down = document.getElementById("down");
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    // click up
    act(() => {
      up.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockFx.mock.calls.length).toBe(1);
    expect(mockFx.mock.calls[0][1]).toBe(0);
    expect(mockFx.mock.calls[0][2]).toBe(-100);
    // click down
    act(() => {
      down.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockFx.mock.calls.length).toBe(2);
    expect(mockFx.mock.calls[1][1]).toBe(0);
    expect(mockFx.mock.calls[1][2]).toBe(100);
    // click left
    act(() => {
      left.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockFx.mock.calls.length).toBe(3);
    expect(mockFx.mock.calls[2][1]).toBe(-100);
    expect(mockFx.mock.calls[2][2]).toBe(0);
    // click right
    act(() => {
      right.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockFx.mock.calls.length).toBe(4);
    expect(mockFx.mock.calls[3][1]).toBe(100);
    expect(mockFx.mock.calls[3][2]).toBe(0);
  });
});