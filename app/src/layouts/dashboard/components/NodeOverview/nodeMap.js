import React, { useState } from "react";
import { Graph } from "react-d3-graph";

const NodeDetails = ({ node, onClose }) => {
  if (!node) {
    return null;
  }

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
      <p><strong>Depth:</strong> {node.depth}</p>
      <button onClick={onClose} style={{ padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Close</button>
    </div>
  );
};

const NodeMap = ({ onClickNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const data = {
    nodes: [
      {
        id: "Harry",
        Commodities: ["bslack", "esses"],
      },
      {
        id: "Sally",
        Commodities: ["sdds", "sdsds"],
      },
      {
        id: "Alice",
        Commodities: ["sas", "esses"],
      },
    ],
    links: [
      { source: "Harry", target: "Sally" },
      { source: "Harry", target: "Alice" },
    ],
  };
  const handleNodeClick = function (nodeId) {
    const node = data.nodes.find((node) => node.id === nodeId);
    onClickNode(node);
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
  data.links.forEach(link => {
    linkCount[link.source] = (linkCount[link.source] || 0) + 1;
    linkCount[link.target] = (linkCount[link.target] || 0) + 1;
  });

  // Add a size property and color to each node
  data.nodes.forEach(node => {
    node.size = 120 + (linkCount[node.id] || 0) * 200;
    node.color = colorMapping[node.Commodities[0]]; // setting the color according to the first commodity
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