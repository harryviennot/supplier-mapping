import React, { useState, useEffect } from "react";
import { Treemap } from "@ant-design/plots";

const LocationTree = ({ filter }) => {
  const [fetchData, setFetchData] = useState([]);
  const [countryData, setCountryData] = useState({});
  const [data, setData] = useState({ name: "root", children: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default country codes for safety
  const DEFAULT_COUNTRIES = {
    US: "United States",
    UK: "United Kingdom",
    FR: "France",
    DE: "Germany",
    CN: "China",
    CA: "Canada",
    BR: "Brazil",
    AT: "Austria",
    IT: "Italy",
    RU: "Russia",
  };

  const getCountryByCode = (code) => {
    if (!code || code === "N/A") return "Unknown";

    // First check our loaded data
    const country = countryData[code];
    if (country) return country;

    // Then check our default fallback
    if (DEFAULT_COUNTRIES[code]) return DEFAULT_COUNTRIES[code];

    // If all else fails, return the code itself
    return code;
  };

  const transformData = (data) => {
    try {
      setLoading(true);

      if (!data || data.length === 0) {
        setData({ name: "root", children: [] });
        setLoading(false);
        return;
      }

      let countryMap = {};

      data.forEach((item) => {
        if (!item.location || !Array.isArray(item.location) || item.location.length === 0) return;

        const countryCode = item.location[0];
        if (!countryCode || countryCode === "N/A") return;

        const country = getCountryByCode(countryCode);
        const city = item.location.length > 1 ? item.location[1] : "Unknown";

        if (!countryMap[country]) {
          countryMap[country] = {
            name: country,
            country: country,
            value: 0,
          };

          if (filter === "city") {
            countryMap[country].children = [];
          }
        }

        countryMap[country].value += 1;

        if (filter === "city" && city !== "N/A" && city !== "Unknown") {
          let cityIndex = countryMap[country].children.findIndex((c) => c.name === city);

          if (cityIndex === -1) {
            countryMap[country].children.push({ name: city, value: 1 });
          } else {
            countryMap[country].children[cityIndex].value += 1;
          }
        }
      });

      let transformedData = Object.values(countryMap);

      const localData = {
        name: "root",
        children: transformedData,
      };

      setData(localData);
    } catch (err) {
      console.error("Error transforming data:", err);
      setError("Failed to process location data");
      setData({ name: "root", children: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load country data
    fetch("/countries.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load countries data: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        let data = {};
        const rows = text.split("\n");
        rows.forEach((row) => {
          if (!row.trim()) return;

          const parts = row.split(";");
          if (parts.length >= 4) {
            const [countryCode, x, y, country] = parts;
            if (countryCode && country) {
              data[countryCode] = country.replace(/\r$/, "");
            }
          }
        });

        // Add defaults for safety
        Object.keys(DEFAULT_COUNTRIES).forEach((code) => {
          if (!data[code]) {
            data[code] = DEFAULT_COUNTRIES[code];
          }
        });

        setCountryData(data);
      })
      .catch((err) => {
        console.error("Error loading country data:", err);
        setCountryData(DEFAULT_COUNTRIES);
      });

    // Load node data
    fetch("/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load data.json: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.nodes) {
          setFetchData(data.nodes);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((err) => {
        console.error("Error loading node data:", err);
        setError("Failed to load data");
        setFetchData([]);
      });
  }, []);

  useEffect(() => {
    if (fetchData.length > 0) {
      transformData(fetchData);
    }
  }, [filter, fetchData, countryData]);

  const config = {
    data,
    colorField: "country",
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading location data...</div>;
  }

  if (!data || !data.children || data.children.length === 0) {
    return <div>No location data available</div>;
  }

  return <Treemap {...config} />;
};

export default LocationTree;
