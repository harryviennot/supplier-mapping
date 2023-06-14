// @mui material components
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import NodeMap from "./nodeMap";

function NodeOverview() {
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Map View
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox md={3}>
        <NodeMap />
      </MDBox>
    </Card>
  );
}

export default NodeOverview;
