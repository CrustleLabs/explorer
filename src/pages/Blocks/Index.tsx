import * as React from "react";
import BlocksTable from "./Table";
import {useGetMostRecentBlocks} from "../../api/hooks/useGetMostRecentBlocks";
import {Box} from "@mui/material";
import PageHeader from "../layout/PageHeader";
import {usePageMetadata} from "../../components/hooks/usePageMetadata";
import {useSearchParams} from "react-router-dom";

const BLOCKS_COUNT = 30;

export default function BlocksPage() {
  const [params] = useSearchParams();
  const start = params.get("start");
  const actualStart = start ? start : undefined;
  const {recentBlocks, isLoading} = useGetMostRecentBlocks(
    actualStart,
    BLOCKS_COUNT,
  );

  usePageMetadata({title: "Latest Blocks"});

  return (
    <>
      <Box>
        <PageHeader />
        <BlocksTable blocks={recentBlocks} isLoading={isLoading} />
      </Box>
    </>
  );
}
