import React, { useState, useCallback } from "react";
import { Comp1, Comp2, Comp3 } from "./ControlledComps";

export const Controller = () => {
  const [view, setView] = useState("comp1");
  const [dataComp2, setDataComp2] = useState();

  const changeComp = useCallback(() => setView("comp2"), []);

  const saveComp2 = useCallback((passingData) => {
    setDataComp2(passingData);
    setView("comp3");
  });

  const submitComp3 = useCallback(() => {
    setView("comp1");
  }, []);

  switch (view) {
    case "comp2":
      return <Comp2 onSave={saveComp2} />;
    case "comp3":
      return <Comp3 dataComp2={dataComp2} onSave={submitComp3} />;
    default:
      return (
        <>
          <div className="button-bar">
            <button type="button" id="add-comp" onClick={changeComp}>
              Add component
            </button>
            <Comp1 />
          </div>
        </>
      );
  }
};
