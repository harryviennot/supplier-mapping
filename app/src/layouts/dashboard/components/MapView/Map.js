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

// Default coordinates for countries that might be missing
const DEFAULT_COORDINATES = {
  US: { lat: 37.0902, lng: -95.7129 },
  GB: { lat: 55.3781, lng: -3.436 },
  FR: { lat: 46.2276, lng: 2.2137 },
};

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the map.</div>;
    }

    return this.props.children;
  }
}

const MapChart = () => {
  const [loading, setLoading] = useState(true);
  const [countryData, setCountryData] = useState({});
  const [maxValue] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/countries.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load countries data: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        const data = {};
        const rows = text.split("\n");
        rows.forEach((row) => {
          if (!row.trim()) return; // Skip empty lines
          const parts = row.split(";");
          if (parts.length >= 3) {
            const [countryCode, lat, lon] = parts;
            if (countryCode && lat && lon) {
              data[countryCode] = {
                lat: parseFloat(lat),
                lng: parseFloat(lon),
              };
            }
          }
        });

        // Add default coordinates for safety
        Object.keys(DEFAULT_COORDINATES).forEach((code) => {
          if (!data[code]) {
            data[code] = DEFAULT_COORDINATES[code];
          }
        });

        setCountryData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading country data:", err);
        setError(err.message);
        // Use default coordinates as fallback
        setCountryData(DEFAULT_COORDINATES);
        setLoading(false);
      });
  }, []);

  const getCoordinates = (country) => {
    // Check if the country code exists in our data
    if (countryData[country]) {
      return [countryData[country].lng, countryData[country].lat];
    }

    // Use default coordinates if available
    if (DEFAULT_COORDINATES[country]) {
      return [DEFAULT_COORDINATES[country].lng, DEFAULT_COORDINATES[country].lat];
    }

    // Return a default position if country is not found
    console.warn(`Country code not found: ${country}`);
    return [0, 0]; // Default to [0,0] as a fallback
  };

  const popScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxValue || 1])
        .range([1, 10]),
    [maxValue]
  );

  if (error) {
    return <div>Error loading map data: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <div style={{ width: "100%", height: "400px" }}>
        {loading ? (
          <div>Loading map data...</div>
        ) : (
          <ComposableMap projectionConfig={{ scale: 147 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#DDD"
                    stroke="#FFF"
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>
            {DBdata.map(({ id, links, location }) => {
              try {
                const { country } = location;
                const coordinates = getCoordinates(country);
                return (
                  <Marker key={id} coordinates={coordinates}>
                    <circle
                      fill="#F53"
                      stroke="#FFF"
                      r={links.length > 0 ? popScale(links.length) : 3}
                    />
                  </Marker>
                );
              } catch (err) {
                console.error(`Error rendering marker for ID ${id}:`, err);
                return null;
              }
            })}
          </ComposableMap>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MapChart;
