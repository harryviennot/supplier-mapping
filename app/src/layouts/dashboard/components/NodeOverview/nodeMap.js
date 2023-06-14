import React, { useState, useEffect, useMemo, useRef } from "react";
import { Graph } from "react-d3-graph";
import { Button } from "@mui/material";
import NodeDetails from "./nodeDetails";
import { Box, Slider, Typography } from "@mui/material";

const NodeMap = ({ onClickNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [data, setData] = useState({
    nodes: [],
    links: [],
  });

  const graphContainerRef = useRef(null);
  const graphRef = useRef(null);

  const [graphConfig, setGraphConfig] = useState({
    width: 800, // initial width, will be updated once the container is measured
    height: 600, // initial height, will be updated once the container is measured
    nodeHighlightBehavior: true,
    node: {
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
      semanticStrokeWidth: true,
      strokeWidth: 1.5,
      color: "color",
    },
    directed: true,
  });

  useEffect(() => {
    const updateGraphSize = () => {
      if (graphContainerRef.current) {
        const boundingRect = graphContainerRef.current.getBoundingClientRect();
        setGraphConfig((config) => ({
          ...config,
          width: boundingRect.width - 10,
          height: boundingRect.height,
        }));
      }
    };

    updateGraphSize();

    window.addEventListener("resize", updateGraphSize);
    return () => window.removeEventListener("resize", updateGraphSize);
  }, []);

  const colorMapping = useMemo(
    () => ({
      Aerostructure: "red",
      Material: "green",
      Equipments: "blue",
      Cabine: "yellow",
      Propulsion: "purple",
    }),
    []
  );

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((loadedData) => {
        const linkCount = {};
        let maxLinks = 0;

        loadedData.links.forEach((link) => {
          linkCount[link.source] = (linkCount[link.source] || 0) + 1;
          linkCount[link.target] = (linkCount[link.target] || 0) + 1;

          maxLinks = Math.max(maxLinks, linkCount[link.source], linkCount[link.target]);
        });

        const calculateRisk = (nodeId) => {
          const links = loadedData.links.filter(
            (link) => link.source === nodeId || link.target === nodeId
          );
          const normalizedRisk = (links.length / maxLinks) * 10;
          return normalizedRisk.toFixed(2);
        };

        loadedData.nodes.forEach((node) => {
          node.size = 120 + (linkCount[node.id] || 0) * 200;
          node.color = colorMapping[node.commodities[0]];
          node.risk = calculateRisk(node.id);
          localStorage.setItem(`risk-${node.id}`, node.risk);
        });

        loadedData.links.forEach((link) => {
          link.color = "gray";
        });

        setData(loadedData);
      });
  }, [colorMapping]);

  const [riskRange, setRiskRange] = useState([0, 10]);

  const handleSliderChange = (event, newValue) => {
    setRiskRange(newValue);
  };

  const handleNodeClick = function (nodeId) {
    const node = data.nodes.find((node) => node.id === nodeId);
    setSelectedNode(node);
  };

  useEffect(() => {
    if (selectedNode) {
      // Create a new copy of nodes and links
      let newNodes = [...data.nodes];
      let newLinks = [...data.links];

      // Reset all nodes and links to default color
      newNodes.forEach((node) => (node.color = colorMapping[node.commodities[0]]));
      newLinks.forEach((link) => (link.color = "gray"));

      // Function for DFS
      const dfs = (currentNodeId, visitedNodes) => {
        // If we already visited this node, do nothing
        if (visitedNodes[currentNodeId]) {
          return;
        }

        // Mark the node as visited
        visitedNodes[currentNodeId] = true;

        // Find and color all links connected to the current node
        newLinks.forEach((link) => {
          if (link.source === currentNodeId) {
            link.color = "red";
            // Continue DFS with the target node
            dfs(link.target, visitedNodes);
          }
        });
      };

      // Start DFS with the selected node
      dfs(selectedNode.id, {});

      // Update data
      setData({
        nodes: newNodes,
        links: newLinks,
      });
    }
  }, [selectedNode, colorMapping, data]);

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  const handleResetClick = () => {
    const newData = { ...data };
    newData.links.forEach((link) => (link.color = "gray"));
    setData(newData);
    console.log(graphRef.current);
    if (graphRef.current) {
      graphRef.current.resetNodesPositions();
    }
  };

  return (
    <div style={{ margin: "0 auto", padding: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
        <Button
          onClick={handleResetClick}
          variant="contained"
          style={{ backgroundColor: "blue", color: "white" }}
        >
          Reset
        </Button>
      </div>
      <div ref={graphContainerRef} style={{ width: "100%", height: "100%" }}>
        <Graph
          id="graph-id"
          data={{
            nodes: data.nodes.filter(
              (node) => node.risk >= riskRange[0] && node.risk <= riskRange[1]
            ),
            links: data.links.filter((link) => {
              let sourceRisk = data.nodes.find((node) => node.id === link.source).risk;
              let targetRisk = data.nodes.find((node) => node.id === link.target).risk;
              return (
                sourceRisk >= riskRange[0] &&
                sourceRisk <= riskRange[1] &&
                targetRisk >= riskRange[0] &&
                targetRisk <= riskRange[1]
              );
            }),
          }}
          config={graphConfig}
          onClickNode={handleNodeClick}
          onClickLink={onClickLink}
          automaticRearrangeAfterDropNode={true}
        />
      </div>
      <NodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};

export default NodeMap;
