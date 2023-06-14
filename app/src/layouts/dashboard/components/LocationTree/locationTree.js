import React, { useState, useEffect } from "react";
import { Treemap } from "@ant-design/plots";

const LocationTree = ({ filter }) => {
  const [fetchData, setFetchData] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const transformData = (data) => {
    setLoading(true);
    let countryMap = {};
    data.forEach((item) => {
      if (!item.location || item.location.length === 0) return;
      let country = item.location[0];
      if (country === "N/A") return;
      let city = item.location[1];
      if (!countryMap[country]) {
        countryMap[country] = { name: country, country: country, value: 0 };
        filter === "city" && (countryMap[country].children = []);
      }
      countryMap[country].value += 1;
      if (filter !== "city" || city === "N/A") return;
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

    console.log(localData);

    setData(localData);
    setLoading(false);
  };

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setFetchData(data.nodes);
      });
  }, []);

  useEffect(() => {
    transformData(fetchData);
  }, [filter, fetchData]);

  const config = {
    data,
    colorField: "country",
  };
  return loading ? <div>loading</div> : <Treemap {...config} />;
};

export default LocationTree;
