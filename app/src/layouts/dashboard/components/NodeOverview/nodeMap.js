import React, { useState, useEffect } from "react";
import { Graph } from "react-d3-graph";

const NodeDetails = ({ node, onClose }) => {
  if (!node) {
    return null;
  }

  const risk = localStorage.getItem(`risk-${node.id}`);
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '10px',
      marginTop: '15px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Node Details:</h2>
      <p><strong>Name:</strong> {node.id}</p>
      <p><strong>Commodities:</strong> {node.Commodities.join(', ')}</p>
      <p><strong>Risk:</strong> {risk}</p>
      <button onClick={onClose} style={{ padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Close</button>
    </div>
  );
};


const NodeMap = ({ onClickNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [data, setData] = useState({
    nodes: [],
    links: []
  });

  useEffect(() => {
    // Load data from a json file
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);
  
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

// Compute number of links per node
const linkCount = {};
let maxLinks = 0;
data.links.forEach(link => {
  linkCount[link.source] = (linkCount[link.source] || 0) + 1;
  linkCount[link.target] = (linkCount[link.target] || 0) + 1;

  maxLinks = Math.max(maxLinks, linkCount[link.source], linkCount[link.target]);
});

const calculateRisk = (nodeId) => {
  const links = data.links.filter((link) => link.source === nodeId || link.target === nodeId);
  const normalizedRisk = (links.length / maxLinks) * 10; // Calculate normalized risk here
  return normalizedRisk.toFixed(2); // Use toFixed to limit decimal places
};

// Add a size property, color and risk to each node
data.nodes.forEach(node => {
  node.size = 120 + (linkCount[node.id] || 0) * 200;
  node.color = colorMapping[node.Commodities[0]]; // setting the color according to the first commodity
  node.risk = calculateRisk(node.id);
  localStorage.setItem(`risk-${node.id}`, node.risk);
});


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
      <Graph
        id="graph-id"
        data={data}
        config={myConfig}
        onClickNode={handleNodeClick}
        onClickLink={onClickLink}
      />
      <NodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};

export default NodeMap;