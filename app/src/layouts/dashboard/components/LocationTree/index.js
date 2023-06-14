/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

import { Switch } from "antd";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import LocationTree from "./locationTree";

function Locations() {
  const [filter, setFilter] = useState("country");

  const changeFilter = (checked) => {
    setFilter(checked ? "city" : "country");
  };

  const renderMenu = <Switch onChange={changeFilter} />;

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Locations
          </MDTypography>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <LocationTree filter={filter} />
      </MDBox>
    </Card>
  );
}

export default Locations;
