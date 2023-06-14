import React, { useState, useEffect } from "react";
import { Treemap } from "@ant-design/plots";

const LocationTree = ({ filter }) => {
  const [fetchData, setFetchData] = useState([]);
  const [countryData, setCountryData] = useState({});
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getCountryByCode = (code) => {
    const country = countryData[code];
    return country ? country : "N/A";
  };

  const transformData = (data) => {
    setLoading(true);
    let countryMap = {};
    data.forEach((item) => {
      if (!item.location || item.location.length === 0) return;
      const country = getCountryByCode(item.location[0]);
      if (country === "N/A") return;
      const city = item.location[1];
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

    setData(localData);
    setLoading(false);
  };

  useEffect(() => {
    fetch("/countries.csv")
      .then((response) => response.text())
      .then((text) => {
        let data = {};
        const rows = text.split("\n");
        rows.forEach((row) => {
          let [countryCode, x, y, country] = row.split(";");
          data[countryCode] = country.replace(/\r$/, "");
        });
        setCountryData(data);
      });
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
