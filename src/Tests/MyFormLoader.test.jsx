import React from "react";
import { createContainer } from "./DomManipulators";
import {
  fetchResponseOk,
  fetchResponseError,
  requestBodyOf,
} from "./SpyHelpers";
import { MyFormLoader } from "../Components/MyFormLoader";
import "whatwg-fetch";
import * as MyFormExports from "../Components/MyForm";

describe("MyFormLoader", () => {
  let renderAndWait, container;

  const dataArr = [
    { name: "Bob", age: 45 },
    { name: "Pol", age: 12 },
  ];
  beforeEach(() => {
    ({ renderAndWait, container } = createContainer());
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk(dataArr));
    jest.spyOn(MyFormExports, "MyForm").mockReturnValue(null);
  });
  afterEach(() => {
    window.fetch.mockRestore();
    MyFormExports.MyForm.mockRestore();
  });
  it("fetches data when component is mounted", async () => {
    await renderAndWait(<MyFormLoader />);
    expect(window.fetch).toHaveBeenCalledWith(
      "/info",
      expect.objectContaining({
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-type": "application/json" },
      })
    );
  });
  it("initially passes no data to MyForm", async () => {
    await renderAndWait(<MyFormLoader />);
    expect(MyFormExports.MyForm).toHaveBeenCalledWith(
      { data: [] },
      expect.anything()
    );
  });
  it("displays time slots that are fetched on mount", async () => {
    await renderAndWait(<MyFormLoader />);
    expect(MyFormExports.MyForm).toHaveBeenLastCalledWith(
      { data: dataArr },
      expect.anything()
    );
  });
  it("calls window.fetch just once", async () => {
    await renderAndWait(<MyFormLoader />);
    await renderAndWait(<MyFormLoader />);
    expect(window.fetch.mock.calls.length).toBe(1);
  });
  it("passes props through to children", async () => {
    await renderAndWait(<MyFormLoader testProp={123} />);
    expect(MyFormExports.MyForm).toHaveBeenCalledWith(
      expect.objectContaining({ testProp: 123 }),
      expect.anything()
    );
  });
});
