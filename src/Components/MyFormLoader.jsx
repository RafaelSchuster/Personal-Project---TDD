import React, { useEffect, useState } from "react";
import { MyForm } from "./MyForm";

export const MyFormLoader = (props) => {
  const [dataFetch, setdataFetch] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fetch("/info", {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-type": "application/json" },
      });
      setdataFetch(await response.json());
    };
    fetchData();
  }, []);
  return <MyForm data={dataFetch} {...props} />;
};
