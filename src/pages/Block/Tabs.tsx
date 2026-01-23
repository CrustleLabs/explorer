import * as React from "react";
import {Box, Grid, Stack} from "@mui/material";
import OverviewTab from "./Tabs/OverviewTab";
import TransactionsTab from "./Tabs/TransactionsTab";
import {assertNever} from "../../utils";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import StyledTabs from "../../components/StyledTabs";
import StyledTab from "../../components/StyledTab";
import {useParams} from "react-router-dom";
import {useNavigate} from "../../routing";
import {Block} from "@aptos-labs/ts-sdk";
import BlockDetailsSidebar from "./Components/BlockDetailsSidebar";
import BlockStatsRow from "./Components/BlockStatsRow";

const TAB_VALUES: TabValue[] = ["overview", "transactions"];

const TabComponents = Object.freeze({
  overview: OverviewTab,
  transactions: TransactionsTab,
});

type TabValue = keyof typeof TabComponents;

function getTabLabel(value: TabValue): string {
  switch (value) {
    case "overview":
      return "Overview";
    case "transactions":
      return "Transactions";
    default:
      return assertNever(value);
  }
}

function getTabIcon(value: TabValue) {
  switch (value) {
    case "overview":
      return <BarChartOutlinedIcon fontSize="small" />;
    case "transactions":
      return <WysiwygIcon fontSize="small" />;
    default:
      return assertNever(value);
  }
}

type TabPanelProps = {
  value: TabValue;
  data?: Block;
  isLoading?: boolean;
};

function TabPanel({value, data, isLoading}: TabPanelProps) {
  const TabComponent = TabComponents[value];
  // @ts-expect-error - TabComponent props might not perfectly align in union used by strict TS, but we know they accept data/isLoading
  return <TabComponent data={data} isLoading={isLoading} />;
}

type AccountTabsProps = {
  data?: Block;
  isLoading?: boolean;
  tabValues?: TabValue[];
};

export default function BlockTabs({
  data,
  isLoading,
  tabValues = TAB_VALUES,
}: AccountTabsProps) {
  const {height, tab} = useParams();
  const navigate = useNavigate();
  const value = tab === undefined ? TAB_VALUES[0] : (tab as TabValue);

  const handleChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    navigate(`/block/${height}/${newValue}`, {replace: true});
  };

  return (
    <Box sx={{width: "100%"}}>
      <Box>
        <StyledTabs value={value} onChange={handleChange}>
          {tabValues.map((value, i) => (
            <StyledTab
              key={i}
              value={value}
              icon={getTabIcon(value)}
              label={getTabLabel(value)}
              isFirst={i === 0}
              isLast={i === tabValues.length - 1}
            />
          ))}
        </StyledTabs>
      </Box>
      <Box mt={3}>
        <Grid container spacing={4}>
          {/* Left Column: Stats + Tab Content in a Card */}
          <Grid size={{xs: 12, md: 8}}>
            <Box
              sx={{
                backgroundColor: "rgba(31, 28, 37, 0.6)",
                border: "0.5px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "24px",
                p: "20px",
              }}
            >
              <Stack spacing={3}>
                {/* Persistent Stats Row - visible on all tabs */}
                <BlockStatsRow data={data} isLoading={isLoading} />
                {/* Tab-specific content */}
                <TabPanel value={value} data={data} isLoading={isLoading} />
              </Stack>
            </Box>
          </Grid>
          {/* Right Column: Block Details Sidebar */}
          <Grid size={{xs: 12, md: 4}}>
            <BlockDetailsSidebar data={data} isLoading={isLoading} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
