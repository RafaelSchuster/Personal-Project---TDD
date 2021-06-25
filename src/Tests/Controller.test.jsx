import React from "react";
import {
  createShallowRenderer,
  childrenOf,
  className,
  type,
  click,
  id,
} from "./ShallowHelpers";
import { Controller } from "../Components/Controller";
import { Comp1, Comp2, Comp3 } from "../Components/ControlledComps";

describe("Controller", () => {
  let render, elementMatching, child;
  beforeEach(() => {
    ({ render, elementMatching, child } = createShallowRenderer());
  });
  it("initially renders the ControlledComp1", () => {
    render(<Controller />);
    expect(elementMatching(type(Comp1))).toBeDefined();
  });
  it("has a button bar as the first child", () => {
    render(<Controller />);
    expect(child(0).type).toEqual("div");
    expect(child(0).props.className).toEqual("button-bar");
  });
  it("has a button to open comp2", () => {
    render(<Controller />);
    const buttons = childrenOf(elementMatching(className("button-bar")));
    expect(buttons[0].type).toEqual("button");
    expect(buttons[0].props.children).toEqual("Add component");
  });
  const onClickRenderComp2 = () => {
    render(<Controller />);
    click(elementMatching(id("add-comp")));
  };
  it("displays comp2 upon click", async () => {
    onClickRenderComp2();
    expect(elementMatching(type(Comp2))).toBeDefined();
  });
  it("hides Comp1 when button is clicked", async () => {
    onClickRenderComp2();
    expect(elementMatching(type(Comp1))).not.toBeDefined();
  });
  it("hides button-bar when button is clicked", async () => {
    onClickRenderComp2();
    expect(elementMatching(className("button-bar"))).not.toBeTruthy();
  });

  const saveComp2 = (saveData) => {
    elementMatching(type(Comp2)).props.onSave(saveData);
  };

  it("displays Comp3 after submitting Comp2", async () => {
    onClickRenderComp2();
    saveComp2();
    expect(elementMatching(type(Comp3))).toBeDefined();
  });
  it("passes right data from comp2 to comp3", async () => {
    const dataComp2 = { id: 123 };
    onClickRenderComp2();
    saveComp2(dataComp2);
    expect(elementMatching(type(Comp3)).props.dataComp2).toBe(dataComp2);
  });
  const submitComp3 = () => {
    elementMatching(type(Comp3)).props.onSave();
  };
  it("renders Comp1 after submitting Comp3", async () => {
    onClickRenderComp2();
    saveComp2();
    submitComp3();
    expect(elementMatching(type(Comp1))).toBeDefined();
  });
});
