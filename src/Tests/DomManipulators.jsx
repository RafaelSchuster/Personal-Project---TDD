import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";

export const withEvent = (name, value) => ({ target: { name, value } });

export const createContainer = () => {
  const container = document.createElement("div");
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const field = (formId, name) => form(formId).elements[name];
  const labelFor = (name) => container.querySelector(`label[name="${name}"]`);
  const element = (selector) => container.querySelector(selector);
  const simulateEvent = (event) => (element, eventData) =>
    ReactTestUtils.Simulate[event](element, eventData);
  const simulateEventAndWait = (event) => async (element, eventData) =>
    await act(async () => ReactTestUtils.Simulate[event](element, eventData));

  return {
    render: (component) =>
      act(() => {
        ReactDOM.render(component, container);
      }),
    renderAndWait: async (component) =>
      await act(async () => ReactDOM.render(component, container)),
    container,
    form,
    field,
    labelFor,
    element,
    click: simulateEvent("click"),
    change: simulateEvent("change"),
    submit: simulateEventAndWait("submit"),
    blur: simulateEvent("blur"),
  };
};
