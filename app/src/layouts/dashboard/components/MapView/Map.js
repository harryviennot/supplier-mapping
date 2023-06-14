import React, { useEffect, useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

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
];

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const MapChart = () => {
  const [loading, setLoading] = useState(true);
  const [countryData, setCountryData] = useState({});
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/countries.csv")
      .then((response) => response.text())
      .then((text) => {
        const data = {};
        const rows = text.split("\n");
        rows.forEach((row) => {
          const [countryCode, lat, lon, country] = row.split(";");
          data[countryCode] = {
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          };
        });
        setCountryData(data);
        setLoading(false);
      });
  }, []);

  const getCoordinates = (country) => {
    const { lat, lng } = countryData[country];
    return [lng, lat];
  };

  const popScale = useMemo(() => scaleLinear().domain([0, maxValue]).range([0, 20]), [maxValue]);

  return (
    <ComposableMap projectionConfig={{ rotate: [-10, 0, 0] }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} fill="#DDD" />)
        }
      </Geographies>
      {!loading &&
        DBdata.map(({ id, links, location }) => {
          const { country } = location;
          const coordinates = getCoordinates(country);
          return (
            <Marker key={id} coordinates={coordinates}>
              <circle fill="#F53" stroke="#FFF" r={popScale(links.length)} />
            </Marker>
          );
        })}
    </ComposableMap>
  );
};

export default MapChart;
