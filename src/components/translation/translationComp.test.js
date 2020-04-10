import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { fireEvent } from '@testing-library/react'
import Translation from './translationComp';

describe('render', () => {

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

  test('render', () => {
    act(() => {
      render(
        <Translation
        />, container
      );
    });
  });
});

describe('component', () => {

  let container = null;
  let mockTranslate;
  let translationFactor = 1;
  let mockHandle;
  let mockAddToStack;
  let up;
  let down;
  let left;
  let right;
  let factorBox;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    mockTranslate = jest.fn();
    mockHandle = jest.fn();
    mockAddToStack = jest.fn();
    act(() => {
      render(
        <Translation
          // translate = {mockTranslate}
          translationFactor = {translationFactor}
          handleChange = {mockHandle}
          addToStack = {mockAddToStack}
        />, container
      );
    });
    up = document.getElementById("up");
    down = document.getElementById("down");
    left = document.getElementById("left");
    right = document.getElementById("right");
    factorBox = document.getElementById("factorBox");
  });
  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });
  
  test('click up', () => {
    act(() => {
      up.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockAddToStack.mock.calls.length).toBe(1);
  });
  test('click down', () => {
    act(() => {
      down.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockAddToStack.mock.calls.length).toBe(1);
  });
  test('click left', () => {
    act(() => {
      left.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockAddToStack.mock.calls.length).toBe(1);
  });
  test('click right', () => {
    act(() => {
      right.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockAddToStack.mock.calls.length).toBe(1);
  });
  test('change factorBox', () => {
    for (let i = 1; i <= 18; i++) {
      act(() => {
        fireEvent.change(factorBox, { target: { value: i } });
        factorBox.value = i; // manually change value instead of using mockHandle
      });
      expect(factorBox.value).toBe(i.toString());
      expect(mockHandle.mock.calls.length).toBe(i);
    }
  });
});