import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import NodeMap from "./nodeMap";

import { useEffect } from "react";

function NodeOverview() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    if (selectedNode) {
      let risk = localStorage.getItem(`risk-${selectedNode.id}`);
      if (risk === null) {
        risk = "0";
      }
      setRisk(risk);
    }
  }, [selectedNode]);

  return (
    <div>
      <NodeMap onClickNode={setSelectedNode} />
      {selectedNode && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              {selectedNode.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Commodities: {selectedNode.Commodities.join(", ")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Risk: {risk}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NodeOverview;
