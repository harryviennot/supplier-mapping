import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Treemap } from "@ant-design/plots";

const LocationTree = () => {
  const data = {
    name: "root",
    children: [
      {
        name: "France",
        value: 560,
      },
      {
        name: "Angleterre",
        value: 500,
      },
      {
        name: "USA",
        value: 150,
      },
      {
        name: "Espagne",
        value: 140,
      },
      {
        name: "Chine",
        value: 115,
      },
      {
        name: "Italie",
        value: 95,
      },
      {
        name: "Japon",
        value: 90,
      },
      {
        name: "Allemagne",
        value: 75,
      },
      {
        name: "Russie",
        value: 98,
      },
      {
        name: "Autres",
        value: 60,
      },
    ],
  };
  const config = {
    data,
    colorField: "name",
  };
  return <Treemap {...config} />;

  return <Treemap {...config} />;
};

export default LocationTree;
