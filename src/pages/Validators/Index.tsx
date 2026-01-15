import * as React from "react";
import {ValidatorsTable} from "./ValidatorsTable";
import {Box} from "@mui/material";
import PageHeader from "../layout/PageHeader";
import {OutOfCommissionPoolsBanner} from "../../components/OutOfCommissionPoolsBanner";
import {usePageMetadata} from "../../components/hooks/usePageMetadata";

export default function ValidatorsPage() {
  usePageMetadata({title: "Validators"});

  return (
    <Box>
      <PageHeader />
      <OutOfCommissionPoolsBanner />
      <ValidatorsTable />
    </Box>
  );
}
