// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";

const NodeMap = () => {
  // graph payload (with minimalist structure)
  const data = {
    nodes: [
      {
        id: "Harry",
        Commodities: ["sas", "esses"],
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

  const [nodeColor, setNodeColor] = useState("");
  const [nodeSize, setNodeSize] = useState(120);

  useEffect(() => {
    if (data.nodes) {
      setNodeColor(data.nodes[0].Commodities[0]);
      setNodeSize(120 + data.links.length * 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: nodeColor,
      size: nodeSize,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
    },
  };

  const onClickNode = function (nodeId) {
    const node = data.nodes.find((node) => node.id === nodeId);
    let commodities = node.Commodities.join(", ");
    alert(`Commodities for ${nodeId}: ${commodities}`);
  };

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  return (
    <Graph
      id="graph-id" // id is mandatory
      data={data}
      config={myConfig}
      onClickNode={onClickNode}
      onClickLink={onClickLink}
    />
  );
};

export default NodeMap;
