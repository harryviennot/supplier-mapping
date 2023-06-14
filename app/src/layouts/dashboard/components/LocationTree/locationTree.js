import React, { useState, useEffect } from "react";
import { Treemap } from "@ant-design/plots";

const DBdata = [
  {
    name: "Harry",
    id: 1,
    commodities: ["A", "B", "C"],
    location: { city: "London", country: "GB" },
    links: [{ relationship: "friend", id: 2 }],
  },
  {
    name: "Sally",
    id: 2,
    commodities: ["A", "B", "C"],
    location: { city: "Toulouse", country: "FR" },
    links: [
      { relationship: "friend", id: 1 },
      { relationship: "friend", id: 3 },
    ],
  },
  {
    name: "Alice",
    id: 3,
    commodities: ["A", "B", "C"],
    location: { city: "Paris", country: "FR" },
    links: [{ relationship: "friend", id: 1 }],
  },
  {
    name: "Bob",
    id: 4,
    commodities: ["A", "B", "C"],
    location: { city: "Washington", country: "US" },
    links: [
      { relationship: "friend", id: 1 },
      { relationship: "friend", id: 2 },
      { relationship: "friend", id: 3 },
    ],
  },
  {
    name: "Bobby",
    id: 4,
    commodities: ["A", "B", "C"],
    location: { city: "Washington", country: "US" },
    links: [
      { relationship: "friend", id: 1 },
      { relationship: "friend", id: 2 },
      { relationship: "friend", id: 3 },
    ],
  },
  {
    name: "Louis",
    id: 4,
    commodities: ["A", "B", "C"],
    location: { city: "Toulouse", country: "FR" },
    links: [
      { relationship: "friend", id: 1 },
      { relationship: "friend", id: 2 },
      { relationship: "friend", id: 3 },
    ],
  },
];

const LocationTree = ({ filter }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const transformData = (data) => {
    setLoading(true);
    let countryMap = {};
    data.forEach((item) => {
      let country = item.location.country;
      let city = item.location.city;
      if (!countryMap[country]) {
        countryMap[country] = { name: country, country: country, value: 0 };
        filter === "city" && (countryMap[country].children = []);
      }
      countryMap[country].value += 1;
      if (filter !== "city") return;
      let cityIndex = countryMap[country].children.findIndex((c) => c.name === city);

      if (cityIndex === -1) {
        countryMap[country].children.push({ name: city, value: 1 });
      } else {
        countryMap[country].children[cityIndex].value += 1;
      }
    });

    let transformedData = Object.values(countryMap);

    const localData = {
      name: "root",
      children: transformedData,
    };

    setData(localData);
    setLoading(false);
  };

  useEffect(() => {
    transformData(DBdata);
  }, [filter, transformData]);

  const config = {
    data,
    colorField: "country",
  };
  return loading ? <div>loading</div> : <Treemap {...config} />;
};

export default LocationTree;
