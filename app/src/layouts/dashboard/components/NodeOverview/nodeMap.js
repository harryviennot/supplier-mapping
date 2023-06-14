import React, { useState, useEffect } from "react";
import { Graph } from "react-d3-graph";

import NodeDetails from "./nodeDetails";
import { Box, Slider, Typography } from '@mui/material';

const NodeMap = ({ onClickNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [data, setData] = useState({
    nodes: [],
    links: []
  });
  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(loadedData => {

        const linkCount = {};
        let maxLinks = 0;

        loadedData.links.forEach(link => {
          linkCount[link.source] = (linkCount[link.source] || 0) + 1;
          linkCount[link.target] = (linkCount[link.target] || 0) + 1;

          maxLinks = Math.max(maxLinks, linkCount[link.source], linkCount[link.target]);
        });

        const calculateRisk = (nodeId) => {
          const links = loadedData.links.filter((link) => link.source === nodeId || link.target === nodeId);
          const normalizedRisk = (links.length / maxLinks) * 10;
          return normalizedRisk.toFixed(2);
        };

        loadedData.nodes.forEach(node => {
          node.size = 120 + (linkCount[node.id] || 0) * 200;
          node.color = colorMapping[node.Commodities[0]];
          node.risk = calculateRisk(node.id);
          localStorage.setItem(`risk-${node.id}`, node.risk);
        });

        setData(loadedData);
      });
  }, []);

  
  const [riskRange, setRiskRange] = useState([0, 10]);

  const handleSliderChange = (event, newValue) => {
    setRiskRange(newValue);
  };

  // After calculating the risk for each node, you can filter the nodes and links based on the current risk range
  let filteredNodes = data.nodes.filter(node => node.risk >= riskRange[0] && node.risk <= riskRange[1]);
  let filteredLinks = data.links.filter(link => {
    let sourceRisk = data.nodes.find(node => node.id === link.source).risk;
    let targetRisk = data.nodes.find(node => node.id === link.target).risk;
    return sourceRisk >= riskRange[0] && sourceRisk <= riskRange[1] && targetRisk >= riskRange[0] && targetRisk <= riskRange[1];
  });

  const handleNodeClick = function (nodeId) {
    const node = data.nodes.find((node) => node.id === nodeId);
    setSelectedNode(node);  // Set the selected node here
  };

  const colorMapping = {
    "sas": "red",
    "esses": "green",
    "sdds": "blue",
    "sdsds": "yellow",
    "bslack": "purple",
  };

  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
      semanticStrokeWidth: true,
      strokeWidth: 1.5
    },
    directed: true,
  };

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };
  
  return (
    <div style={{ margin: '0 auto', maxWidth: '1200px', padding: '15px'}}>
    <Box sx={{ width: 300 }}>
      <Typography id="range-slider" gutterBottom>
        Risk Range
      </Typography>
      <Slider
        value={riskRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        min={0}
        max={10}
      />
    </Box>
    <Graph
      id="graph-id"
      data={{ nodes: filteredNodes, links: filteredLinks }} // use filtered data
      config={myConfig}
      onClickNode={handleNodeClick}
      onClickLink={onClickLink}
    />
    <NodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
  </div>
  );
};

export default NodeMap;