import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import NodeMap from "./nodeMap";

function NodeOverview() {
  const [selectedNode, setSelectedNode] = useState(null);

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
              Commodities: {selectedNode.Commodities.join(', ')}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NodeOverview;
