import React, { useState, useCallback } from "react";

const Error = () => <div className="error2">An error occurred during save</div>;

const required =
  (description) =>
  (
    value //value comes from handleBlur line : const result = validators[target.name](target.value);
  ) =>
    !value || value.trim() === "" ? description : undefined;

const match =
  (re, description) =>
  (
    value //value comes from handleBlur line : const result = validators[target.name](target.value);
  ) =>
    !value.match(re) ? description : undefined;

const list =
  (...validators) =>
  (
    value //value comes from handleBlur line : const result = validators[target.name](target.value);
  ) =>
    validators.reduce(
      (result, validator) => result || validator(value),
      undefined
    );

export const MyForm = ({ text, newText, options, chosen, onSave, dataId }) => {
  const [changes, setChanges] = useState({ newText });
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validators = {
    inputText: required("No empty inputText"),
    inputText2: required("No empty inputText2"),
    inputNumber: list(
      required("No empty inputNumber"),
      match(
        /^[0-9+()\-]*$/,
        "Only numbers, spaces and these symbols are allowed()+-"
      )
    ),
  };

  const anyErrors = (errors) =>
    Object.values(errors).some((error) => error !== undefined);

  const handleBlur = ({ target }) => {
    const result = validators[target.name](target.value);
    setValidationErrors({ ...validationErrors, [target.name]: result });
  };

  const hasError = (fieldName) => validationErrors[fieldName] !== undefined;

  const renderError = (fieldName) => {
    if (hasError(fieldName)) {
      return <span className="error">{validationErrors[fieldName]}</span>;
    }
  };

  const handleChanges = ({ target }) => {
    setChanges((changes) => ({
      ...changes,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    // onSubmit(changes);
    e.preventDefault();
    const validationResult = validateMany(changes);
    if (!anyErrors(validationResult)) {
      const result = await window.fetch("/info", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...changes, newText: newText, dataId: dataId }),
      });

      if (result.ok) {
        const infoWithId = await result.json();
        onSave(infoWithId);
      } else {
        setError(true);
      }
    }
  };

  const validateMany = (fields) =>
    Object.entries(fields).reduce(
      (result, [name, value]) => ({
        ...result,
        [name]: validators[name](value),
      }),
      {}
    );

  return (
    <>
      {error ? <Error /> : null}
      <form id="main-form" onSubmit={handleSubmit}>
        <label name="label-text" htmlFor="inputId">
          Label1
        </label>
        <input
          type="text"
          name="inputText"
          id="inputId"
          value={text}
          onChange={handleChanges}
          onBlur={handleBlur}
        />
        <>{renderError("inputText")}</>
        <label name="label-text2" htmlFor="inputId2">
          Label1
        </label>
        <input
          type="text"
          name="inputText2"
          id="inputId2"
          value={text}
          onChange={handleChanges}
          onBlur={handleBlur}
        />
        <>{renderError("inputText2")}</>
        <input
          name="inputNumber"
          onChange={handleChanges}
          onBlur={handleBlur}
        />
        <>{renderError("inputNumber")}</>
        <select name="selection" value={chosen} readOnly>
          <option value="" />
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <button type="button">Click me</button>
      </form>
      <table id="main-table">
        <tbody>
          <tr>
            <th>First</th>
            <th>Middle</th>
            <th>Last</th>
          </tr>
        </tbody>
      </table>
    </>
  );
};
MyForm.defaultProps = {
  passedChanges: "Passing changes",
  newText: "New Texting Bud",
  options: [1, 2, 3, 4, 5],
  onSave: () => {},
};
