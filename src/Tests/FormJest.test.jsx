import React from "react";
import { createContainer } from "./DomManipulators";
import { MyForm } from "../Components/MyForm.jsx";
import ReactTestUtils, { act } from "react-dom/test-utils";
import {
  fetchResponseOk,
  fetchResponseError,
  requestBodyOf,
} from "./SpyHelpers";
import { withEvent } from "./DomManipulators";
import "whatwg-fetch";

const validSubmitData = {
  inputText: "first",
  inputText2: "second",
  inputNumber: "123456789",
};

describe("MyForm", () => {
  let render,
    container,
    form,
    field,
    labelFor,
    element,
    change,
    submit,
    renderAndWait,
    blur;

  beforeEach(() => {
    ({
      render,
      container,
      form,
      field,
      labelFor,
      element,
      change,
      submit,
      renderAndWait,
      blur,
    } = createContainer());
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  const checkInputTextField = (name) => {
    expect(field("main-form", name)).not.toBeNull();
    expect(field("main-form", name)).toBeTruthy();
    expect(field("main-form", name).tagName).toEqual("INPUT");
    expect(field("main-form", name).type).toEqual("text");
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
      expect(field("main-form", inputName).value).toEqual("Existing text");
    });
  };
  const hasLabelForInput = (labelName, inputName) => {
    it("has a label for respective input", () => {
      render(<MyForm />);
      expect(labelFor(labelName)).not.toBeNull();
      expect(labelFor(labelName)).toBeTruthy();
      expect(labelFor(labelName).htmlFor).toEqual(
        field("main-form", inputName).id
      );
      expect(labelFor(labelName).textContent).toEqual("Label1");
    });
  };

  const submitTheRightPassingData = (propName) => {
    it.skip("submits the right passing data", async () => {
      // expect.hasAssertions();
      const newText = "New Texting Bud";
      render(
        <MyForm
          {...validSubmitData}
          {...{ [propName]: "Existing text" }}
          newText={newText}
        />
      );
      submit(form("main-form"));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        newText: "New Texting Bud",
      });
    });
  };
  it("renders a form", () => {
    render(<MyForm />);
    expect("main-form").not.toBeNull();
  });
  const submitsRightChangingData = (fieldName, value) => {
    it.skip("submits the right changing data", async () => {
      const newText = "New Texting Bud";
      render(<MyForm text="Existing text" newText={newText} />);
      change(field("main-form", fieldName), withEvent(fieldName, value));
      submit(form("main-form"));
      expect(requestBodyOf(window.fetch)).toMatchObject({ [fieldName]: value });
    });
  };

  it.skip("calls fetch with right properties when submitting data", async () => {
    render(<MyForm />);
    submit(form("main-form"));
    expect(window.fetch).toHaveBeenCalledWith(
      "/info",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-type": "application/json" },
      })
    );
  });

  it.skip("notifies onSave when form is submitted", async () => {
    const info = { id: 123 };
    window.fetch.mockReturnValue(fetchResponseOk(info));
    const saveSpy = jest.fn();
    render(<MyForm onSave={saveSpy} />);
    await act(async () => {
      submit(form("main-form"));
    });
    expect(saveSpy).toHaveBeenCalledWith(info);
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<MyForm onSave={saveSpy} />);
    await act(async () => {
      form("main-form");
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it.skip("prevents the default action when submitting the form", async () => {
    const preventDefaultSpy = jest.fn();
    render(<MyForm />);
    await act(async () => {
      submit(form("main-form"), {
        preventDefault: preventDefaultSpy,
      });
    });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it.skip("renders error message when fetch call fails", async () => {
    window.fetch.mockReturnValue(Promise.resolve({ ok: false }));
    render(<MyForm />);
    await act(async () => {
      submit(form("main-form"));
    });
    expect(element(".error2")).not.toBeNull();
    expect(element(".error2").textContent).toMatch("error occurred");
  });

  describe("first input text", () => {
    itRendersAsTextBox("inputText");
    includesTheInputWithPassingText("text", "inputText");
    hasLabelForInput("label-text", "inputText");
    submitTheRightPassingData("text");
    submitsRightChangingData("inputText", "value");
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
    expect(field("main-form", "selection")).toBeTruthy();
    expect(field("main-form", "selection").tagName).toEqual("SELECT");
  });
  it("renders options for the select", () => {
    render(<MyForm />);
    const firstOption = field("main-form", "selection").children[0];
    expect(firstOption.tagName).toEqual("OPTION");
    expect(firstOption.value).toEqual("");
    expect(firstOption.selected).toBeTruthy();
  });
  it("renders options for right values", () => {
    const options = ["a", "b", "c", "d", "e"];
    render(<MyForm options={options} />);
    const arrChildren = Array.from(field("main-form", "selection").children);
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
    const chosenOption = findOption(field("main-form", "selection"), "c");
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
    it.skip("passes right data id to fetch when submitting", async () => {
      await render(<MyForm dataId={543} />);
      await submit(form("main-form"));
      expect(requestBodyOf(window.fetch)).toMatchObject({ dataId: 543 });
    });
  });
  it("displays error msg when first input is blank", () => {
    render(<MyForm />);
    blur(field("main-form", "inputText"), withEvent("inputText", " "));
    expect(element(".error")).not.toBeNull();
    expect(element(".error").textContent).toMatch("No empty inputText");
  });
  it("displays error msg when second input is blank", () => {
    render(<MyForm />);
    blur(field("main-form", "inputText2"), withEvent("inputText2", " "));
    expect(element(".error")).not.toBeNull();
    expect(element(".error").textContent).toMatch("No empty inputText2");
  });
  const itInvalidatesFieldWithValue = (fieldName, value, description) => {
    it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
      render(<MyForm />);
      blur(field("main-form", fieldName), withEvent(fieldName, value));
      expect(element(".error")).not.toBeNull();
      expect(element(".error").textContent).toMatch(description);
    });
  };
  itInvalidatesFieldWithValue("inputText", " ", "No empty inputText");
  itInvalidatesFieldWithValue("inputText2", " ", "No empty inputText2");
  itInvalidatesFieldWithValue("inputNumber", " ", "No empty inputNumber");
  itInvalidatesFieldWithValue(
    "inputNumber",
    "invalid",
    "Only numbers, spaces and these symbols are allowed()+-"
  );
  it("inputNumber accepts right chars", () => {
    render(<MyForm />);
    blur(
      element("[name = 'inputNumber']"),
      withEvent("inputNumber", "0123456789+-()")
    );
    expect(element(".error")).toBeNull();
  });
});
