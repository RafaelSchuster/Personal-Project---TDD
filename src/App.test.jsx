import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import App from "./App";

describe("App", () => {
  let msg;
  let container;

  const render = (component) => ReactDOM.render(component, container);

  beforeEach(() => {
    container = document.createElement("div");
  });

  it("renders a div", () => {
    render(<App />);
    expect(container.querySelector("#main-div")).not.toBeNull();
  });
  it("renders a div with the right content passing props", () => {
    msg = "Nice msging";
    render(<App msg={msg} />);
    expect(container.textContent).toMatch("Nice msging");
  });
  it("renders a div with another right content passing props", () => {
    msg = "Cool Bro";
    render(<App msg={msg} />);
    expect(container.textContent).toMatch("Cool Bro");
  });
  it("renders multiple entries on a ol", () => {
    render(<App entries={[1, 2, 3, 4]} />);
    expect(container.querySelector("ol")).not.toBeNull();
    expect(container.querySelector("ol").childNodes).toHaveLength(4);
    expect(container.querySelector("ol").children).toHaveLength(4);
    expect(container.querySelectorAll("li")).toHaveLength(4);
  });
  it("renders right values for each li", () => {
    render(<App entries={[1, 2, 3, 4, 5]} />);
    expect(container.querySelectorAll("li")[1].textContent).toMatch(String(2));
  });
  it("shows message when no entries", () => {
    render(<App entries={[]} />);
    expect(container.textContent).toMatch("No msgs");
  });
  it("renders a button for every entry", () => {
    const entries = [1, 2, 3, 4, 5];
    render(<App entries={entries} />);
    expect(container.querySelector("li>button")).not.toBeNull();
    expect(container.querySelectorAll("li>button")).toHaveLength(5);
    expect(container.querySelectorAll("li>button")[0].textContent).toEqual(
      "Click me"
    );
  });
  it("renders a button with right content and type", () => {
    const entries = [1, 2, 3, 4, 5];
    render(<App entries={entries} />);
    expect(container.querySelectorAll("li>button")[0].type).toEqual("button");
    entries.map((el, i) => {
      expect(container.querySelectorAll("li>button")[i].textContent).toEqual(
        "Click me"
      );
    });
  });
  it("renders an h1 element", () => {
    render(<App />);
    expect(container.querySelector("h1")).not.toBeNull();
  });
  it("renders a button that update h1 with the right entry", () => {
    const entries = [1, 2, 3, 4, 5];
    render(<App entries={entries} />);
    const buttons = container.querySelectorAll("li>button");
    ReactTestUtils.Simulate.click(buttons[0]);
    expect(container.querySelector("h1").textContent).toMatch("1");
  });
});
