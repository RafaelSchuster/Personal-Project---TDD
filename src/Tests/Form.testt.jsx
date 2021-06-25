import React from "react";
import { createContainer } from "./DomManipulators";
import { MyForm } from "../Components/MyForm.jsx";
import ReactTestUtils, { act } from "react-dom/test-utils";

describe("MyForm", () => {
  let render, container;
  const originalFetch = window.fetch;
  let fetchSpy;

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch = originalFetch;
  });
  const form = (id) => container.querySelector(`form[id="${id}"]`);

  const field = (name) => form("main-form").elements[name];
  const labelFor = (name) =>
    form("main-form").querySelector(`label[name="${name}"]`);

  const checkInputTextField = (name) => {
    expect(field(name)).not.toBeNull();
    expect(field(name)).toBeTruthy();
    expect(field(name).tagName).toEqual("INPUT");
    expect(field(name).type).toEqual("text");
  };

  const itRendersAsTextBox = (fieldName) => {
    it("renders an input text in the form", () => {
      render(<MyForm />);
      checkInputTextField(fieldName);
    });
  };

  const includesTheInputWithPassingText = (propName, inputName) => {
    it("includes the input with the right passing text", () => {
      render(<MyForm {...{ [propName]: "Existing text" }} />);
      expect(field(inputName).value).toEqual("Existing text");
    });
  };
  const hasLabelForInput = (labelName, inputName) => {
    it("has a label for respective input", () => {
      render(<MyForm />);
      expect(labelFor(labelName)).not.toBeNull();
      expect(labelFor(labelName)).toBeTruthy();
      expect(labelFor(labelName).htmlFor).toEqual(field(inputName).id);
      expect(labelFor(labelName).textContent).toEqual("Label1");
    });
  };
  const spy = () => {
    // Spy is a test double that record the value of arguments for further checking
    let receivedArgs;
    let returnValue;
    return {
      fn: (...args) => {
        //This is Test double in the sense that stands in place of a function prop of collaborating components
        receivedArgs = args;
        return returnValue; //This is a stub, that is a test double that returns a value when called, that help us check component behaviour
      },
      receivedArgs: () => receivedArgs,
      receivedArg: (n) => receivedArgs[n],
      stubReturnValue: (value) => (returnValue = value), //Assigns the value for the return value of the stub
    };
  };

  const fetchResponseOk = (body) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    });

  const fetchResponseError = () => Promise.resolve({ ok: false });

  const submitTheRightPassingData = (propName) => {
    it("submits the right passing data", async () => {
      // expect.hasAssertions();
      const newText = "New Texting Bud";
      render(
        <MyForm
          {...{ [propName]: "Existing text" }}
          fetch={fetchSpy.fn}
          newText={newText}
          onSubmit={() => {}}
          // onSubmit={({ newText }) => expect(newText).toEqual("New Texting Bud")}
        />
      );
      ReactTestUtils.Simulate.submit(form("main-form"));
      const fetchOpts = fetchSpy.receivedArg(1);
      expect(JSON.parse(fetchOpts.body)["newText"]).toEqual("New Texting Bud");
    });
  };
  it("renders a form", () => {
    render(<MyForm />);
    expect("main-form").not.toBeNull();
  });
  const submitsRightChangingData = (fieldName, value) => {
    it("submits the right existing changing data", async () => {
      // expect.hasAssertions();
      const newText = "New Texting Bud";
      render(
        <MyForm
          text="Existing text"
          newText={newText}
          fetch={fetchSpy.fn}
          onSubmit={() => {}}
          // onSubmit={(changes) => expect(changes[fieldName]).toEqual(value)}
        />
      );
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName },
      });
      ReactTestUtils.Simulate.submit(form("main-form"));
      const fetchOpts = fetchSpy.receivedArg(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
    });
  };

  const singleArgumentSpy = () => {
    let receivedArg;
    return {
      fn: (arg) => (receivedArg = arg),
      receivedArg: () => receivedArg,
    };
  };

  const submitsRightChangingDataTestSpy = (fieldName, value) => {
    it.skip("submits the right existing changing data tested with spy", async () => {
      const newText = "New Texting Bud";
      // let submitVal;
      const { fn, receivedArg } = singleArgumentSpy();
      render(
        <MyForm
          text="Existing text"
          newText={newText}
          // onSubmit={(changes) => (submitVal = changes)}
          onSubmit={(changes) => fn(changes)}
        />
      );
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName },
      });
      ReactTestUtils.Simulate.submit(form("main-form"));
      // expect(submitVal[fieldName]).toEqual(value);
      // expect(submitVal).toBeDefined();
      expect(receivedArg()[fieldName]).toEqual(value);
    });
  };

  expect.extend({
    toHaveBeenCalled(received) {
      if (received === undefined) {
        return {
          pass: false,
          message: () => "Spy was not called",
        };
      }
      return {
        pass: true,
        message: () => "Spy was called",
      };
    },
  });
  expect.extend({
    toHaveBeenCalledBook(received) {
      if (received.receivedArgs === undefined) {
        return {
          pass: false,
          message: () => "Spy was not called",
        };
      }
      return {
        pass: true,
        message: () => "Spy was called",
      };
    },
  });
  const submitsRightChangingDataTestMultipleArgSpy = async (
    fieldName,
    value
  ) => {
    it.skip("submits the right existing changing data tested with multiple args spy", async () => {
      const newText = "New Texting Bud";
      // let submitVal;
      const { fn, receivedArgs, receivedArg } = spy();
      render(
        <MyForm
          text="Existing text"
          newText={newText}
          // onSubmit={(changes) => (submitVal = changes)}
          onSubmit={(changes) => fn(changes)}
        />
      );
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName },
      });
      ReactTestUtils.Simulate.submit(form("main-form"));
      // expect(submitVal[fieldName]).toEqual(value);
      // expect(submitVal).toBeDefined();
      expect(receivedArgs()).toHaveBeenCalled();
      expect(receivedArgs()).toBeDefined();
      expect(receivedArg(0)[fieldName]).toEqual(value);
    });
  };
  const submitsRightChangingDataTestMultipleArgSpyBookVersion = async (
    fieldName,
    value
  ) => {
    it.skip("submits the right existing changing data tested with multiple args spy", async () => {
      const newText = "New Texting Bud";
      const submitVal = spy();
      render(
        <MyForm
          text="Existing text"
          newText={newText}
          onSubmit={(changes) => submitVal.fn(changes)}
        />
      );
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName },
      });
      ReactTestUtils.Simulate.submit(form("main-form"));
      expect(submitVal).toHaveBeenCalledBook();
      expect(submitVal.receivedArgs()).toBeDefined();
      expect(submitVal.receivedArg(0)[fieldName]).toEqual(value);
    });
  };
  it("calls fetch with right properties when submitting data", async () => {
    render(<MyForm fetch={fetchSpy.fn} onSubmit={() => {}} />);
    ReactTestUtils.Simulate.submit(form("main-form"));
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.receivedArg(0)).toEqual("/info");
    const fetchOpts = fetchSpy.receivedArg(1);
    expect(fetchOpts.method).toEqual("POST");
    expect(fetchOpts.credentials).toEqual("same-origin");
    expect(fetchOpts.headers).toEqual({
      "Content-type": "application/json",
    });
  });

  it("notifies onSave when form is submitted", async () => {
    const info = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(info));
    const saveSpy = spy();
    render(<MyForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("main-form"));
    });
    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy.receivedArg(0)).toEqual(info);
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    fetchSpy.stubReturnValue(fetchResponseError());
    const saveSpy = spy();
    render(<MyForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("main-form"));
    });
    expect(saveSpy.receivedArgs()).not.toHaveBeenCalled();
  });

  it("prevents the default action when submitting the form", async () => {
    const preventDefaultSpy = spy();
    render(<MyForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("main-form"), {
        preventDefault: preventDefaultSpy.fn,
      });
    });
    expect(preventDefaultSpy.receivedArgs()).toHaveBeenCalled();
  });
  it("renders error message when fetch call fails", async () => {
    fetchSpy.stubReturnValue(Promise.resolve({ ok: false }));
    render(<MyForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form("main-form"));
    });
    const errorElement = container.querySelector(".error");
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch("error occurred");
  });

  describe("first input text", () => {
    itRendersAsTextBox("inputText");
    includesTheInputWithPassingText("text", "inputText");
    hasLabelForInput("label-text", "inputText");
    submitTheRightPassingData("text");
    submitsRightChangingData("inputText", "value");
    submitsRightChangingDataTestSpy("inputText", "valueSpy");
    submitsRightChangingDataTestMultipleArgSpy("inputText", "valueSpy");
    submitsRightChangingDataTestMultipleArgSpyBookVersion(
      "inputText",
      "valueSpy"
    );
  });

  describe("second input text", () => {
    itRendersAsTextBox("inputText2");
    includesTheInputWithPassingText("text", "inputText2");
    hasLabelForInput("label-text2", "inputText2");
    submitTheRightPassingData("text");
    submitsRightChangingData("inputText2", "value");
  });
  it("renders a submit button", () => {
    render(<MyForm />);
    const button = form("main-form").querySelector("button");
    expect(button).toBeTruthy();
    expect(button.type).toEqual("button");
    expect(button.tagName).toEqual("BUTTON");
    expect(button.textContent).toEqual("Click me");
  });
  it("renders a select menu", () => {
    render(<MyForm />);
    expect(field("selection")).toBeTruthy();
    expect(field("selection").tagName).toEqual("SELECT");
  });
  it("renders options for the select", () => {
    render(<MyForm />);
    const firstOption = field("selection").children[0];
    expect(firstOption.tagName).toEqual("OPTION");
    expect(firstOption.value).toEqual("");
    expect(firstOption.selected).toBeTruthy();
  });
  it("renders options for right values", () => {
    const options = ["a", "b", "c", "d", "e"];
    render(<MyForm options={options} />);
    const arrChildren = Array.from(field("selection").children);
    const arrContent = arrChildren.map((child) => child.textContent);
    expect(arrContent).toEqual(expect.arrayContaining(options));
  });
  const findOption = (select, option) => {
    const arrChildren = Array.from(select.children);
    return arrChildren.find((child) => child.textContent === option);
  };

  it("pre-selects a chosen value", () => {
    const options = ["a", "b", "c", "d", "e"];
    render(<MyForm options={options} chosen="c" />);
    const chosenOption = findOption(field("selection"), "c");
    expect(chosenOption.selected).toBeTruthy();
  });

  describe("data table", () => {
    it("renders a data table", () => {
      render(<MyForm />);
      expect(container.querySelector("table#main-table")).toBeTruthy();
    });

    it("renders the right values for the headers", () => {
      render(<MyForm />);
      const tableReturn = () => container.querySelector("table");
      const tableHeads = tableReturn().querySelectorAll("tbody >* th");
      expect(tableHeads[0].textContent).toEqual("First");
      expect(
        tableReturn().querySelector("tbody >tr").lastChild.textContent
      ).toEqual("Last");
      expect(
        tableReturn().querySelectorAll("tbody >* th:not(:first-child)")[0]
          .textContent
      ).toEqual("Middle");
      expect(
        tableReturn().querySelectorAll("tbody >* th:not(:last-child)")
      ).toHaveLength(2);
      expect(
        tableReturn().querySelector("tbody >* th:nth-last-child(2)").textContent
      ).toEqual("Middle");
    });
  });
});
