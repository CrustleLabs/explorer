import React from "react";
import {Types} from "aptos";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import moment from "moment";
import {Link} from "../../../routing";
import ContentBox from "../../../components/IndividualPageContent/ContentBox";
import ContentRow from "../../../components/IndividualPageContent/ContentRow";
import {getLearnMoreTooltip} from "../helpers";
import JsonViewCard from "../../../components/IndividualPageContent/JsonViewCard";
import BTCIcon from "../../../assets/svg/perps/btc.svg?react";
import ETHIcon from "../../../assets/svg/perps/eth.svg?react";

type OraclePriceOverviewTabProps = {
  transaction: Types.Transaction;
};

type PriceData = {
  symbol: string;
  price_type: number;
  price: string;
  decimals: number;
  timestamp_usecs: string;
};

type PriceUpdate = {
  epoch: string;
  round: string;
  prices: PriceData[];
  num_submissions: string;
};

type OracleTransaction = {
  type: string;
  version?: string;
  timestamp?: string;
  hash?: string;
  success?: boolean;
  state_change_hash?: string;
  event_root_hash?: string;
  accumulator_root_hash?: string;
  price_update?: PriceUpdate;
  validator_transaction_type?: string;
  block_height?: string | number;
};

const LOGO_MAP: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  BTC: BTCIcon,
  ETH: ETHIcon,
};

// Price type mapping
const PRICE_TYPE_MAP: Record<number, string> = {
  0: "Oracle",
  1: "Index",
  2: "Mark",
};

// Shared label style
const sectionLabelStyle = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "18px",
  mb: 1,
  fontFamily: '"SF Pro", sans-serif',
  fontWeight: 400,
};

export default function OraclePriceOverviewTab({
  transaction,
}: OraclePriceOverviewTabProps) {
  const txnData = transaction as OracleTransaction;
  const priceUpdate = txnData.price_update;

  const [copyTooltipOpen, setCopyTooltipOpen] = React.useState(false);

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopyTooltipOpen(true);
    setTimeout(() => {
      setCopyTooltipOpen(false);
    }, 2000);
  };

  // Group prices by symbol
  const pricesBySymbol = React.useMemo(() => {
    if (!priceUpdate?.prices) return {};
    return priceUpdate.prices.reduce(
      (acc: Record<string, PriceData[]>, price) => {
        const symbol = price.symbol.split("-")[0];
        if (!acc[symbol]) acc[symbol] = [];
        acc[symbol].push(price);
        return acc;
      },
      {},
    );
  }, [priceUpdate]);

  return (
    <Box marginBottom={3}>
      {/* Top Stats Row */}
      <Grid container spacing={1.5} marginBottom={4} alignItems="stretch">
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Status
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "36px",
                backgroundColor: "rgba(3, 168, 129, 0.12)",
                border: "0.5px solid rgba(3, 168, 129, 0.32)",
                color: "#03A881",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              Success
            </Box>
          </Box>
        </Grid>
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Block
            </Typography>
            {txnData.block_height ? (
              <Link
                to={`/block/${txnData.block_height}`}
                color="inherit"
                underline="none"
              >
                <Typography
                  variant="body1"
                  fontWeight={700}
                  fontFamily='"SF Pro", sans-serif'
                  color="#fff"
                  fontSize="18px"
                >
                  {Number(txnData.block_height).toLocaleString()}
                </Typography>
              </Link>
            ) : (
              <Typography
                variant="body1"
                color="#fff"
                fontSize="18px"
                fontWeight={700}
              >
                -
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Time
            </Typography>
            <Typography
              variant="body1"
              fontWeight={700}
              fontFamily='"SF Pro", sans-serif'
              color="#fff"
              fontSize="18px"
            >
              {txnData.timestamp
                ? (() => {
                    const seconds = Math.floor(
                      (Date.now() -
                        Math.floor(Number(txnData.timestamp) / 1000)) /
                        1000,
                    );
                    if (seconds < 60) return `${seconds}s ago`;
                    const minutes = Math.floor(seconds / 60);
                    if (minutes < 60) return `${minutes}m ago`;
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) return `${hours}h ago`;
                    const days = Math.floor(hours / 24);
                    return `${days}d ago`;
                  })()
                : "-"}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{xs: 6, sm: 6, md: 3}} sx={{display: "flex"}}>
          <Box
            sx={{
              backgroundColor: "#232227",
              borderRadius: "12px",
              p: "16px 20px",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="#999"
              display="block"
              mb={1.5}
              fontFamily='"SF Pro", sans-serif'
              fontSize="12px"
            >
              Type
            </Typography>
            <Typography
              variant="body1"
              fontWeight={700}
              fontFamily='"SF Pro", sans-serif'
              color="#fff"
              fontSize="18px"
            >
              Oracle Price
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Transaction Details Card */}
      <Box
        sx={{
          backgroundColor: "#16141A",
          border: "0.5px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "24px",
          p: "20px",
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box
            sx={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#8FC7FA",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{width: 24, height: 24}}
            >
              <path
                d="M5.5 9.47139C6.94445 7.66667 9.44809 5.5 12.0006 5.5C15.3459 5.5 18.1009 8.02742 18.4603 11.277M5.5 9.47139V6.22139M5.5 9.47139H8.75M5.54129 12.7249C5.90198 15.9732 8.65633 18.4991 12.0006 18.4991C14.5514 18.4991 17.0556 16.3333 18.5 14.5269M18.5 14.5269V17.7769M18.5 14.5269H15.25"
                stroke="black"
                strokeWidth="1.86667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
          <Typography
            variant="h6"
            fontFamily='"SF Pro", sans-serif'
            fontWeight={700}
            fontSize="20px"
            color="#fff"
          >
            Transaction Details
          </Typography>
        </Stack>

        {/* Hash */}
        <Box mb={3}>
          <Typography sx={sectionLabelStyle}>Hash</Typography>
          <Tooltip
            title="Copied!"
            open={copyTooltipOpen}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            arrow
            placement="top"
          >
            <Box
              onClick={() => txnData.hash && copyHash(txnData.hash)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(182, 146, 244, 0.08)",
                border: "1px solid rgba(182, 146, 244, 0.24)",
                borderRadius: "74px",
                px: "16px",
                py: "8px",
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(182, 146, 244, 0.12)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: '"SF Pro", sans-serif',
                  fontWeight: 500,
                  lineHeight: "18px",
                  wordBreak: "break-all",
                }}
              >
                {txnData.hash}
              </Typography>
              <ContentCopyIcon sx={{color: "#B692F4", fontSize: 16}} />
            </Box>
          </Tooltip>
        </Box>

        {/* Change Info - Price Table */}
        <Box mb={3}>
          <Typography sx={sectionLabelStyle}>Change Info</Typography>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Table
              size="small"
              sx={{
                tableLayout: "auto",
                borderCollapse: "collapse",
                "& .MuiTableCell-root": {
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "0 !important",
                  padding: "10px 16px",
                },
                "& tr:last-child .MuiTableCell-root": {
                  borderBottom: "none",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#666",
                      fontSize: "11px",
                      fontFamily: '"SF Pro", sans-serif',
                    }}
                  >
                    Symbol
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#666",
                      fontSize: "11px",
                      fontFamily: '"SF Pro", sans-serif',
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "#666",
                      fontSize: "11px",
                      fontFamily: '"SF Pro", sans-serif',
                    }}
                  >
                    Price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(pricesBySymbol).map(([symbol, prices]) =>
                  prices.map((priceData, idx) => {
                    const Icon = LOGO_MAP[symbol];
                    // Price is already in the correct format, decimals is just metadata
                    const priceValue = parseFloat(priceData.price);
                    return (
                      <TableRow key={`${symbol}-${idx}`}>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {Icon && <Icon width={20} height={20} />}
                            <Typography
                              color="#fff"
                              fontSize="13px"
                              fontFamily='"SF Pro", sans-serif'
                              fontWeight={500}
                            >
                              {priceData.symbol}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              backgroundColor:
                                priceData.price_type === 2
                                  ? "rgba(238, 145, 76, 0.12)"
                                  : "rgba(143, 199, 250, 0.12)",
                              color:
                                priceData.price_type === 2
                                  ? "#EE914C"
                                  : "#8FC7FA",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            {PRICE_TYPE_MAP[priceData.price_type] || "Unknown"}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color="#fff"
                            fontSize="13px"
                            fontFamily='"SF Pro", sans-serif'
                            fontWeight={600}
                          >
                            $
                            {priceValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  }),
                )}
                {(!priceUpdate?.prices || priceUpdate.prices.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography
                        color="#666"
                        fontSize="12px"
                        fontFamily='"SF Pro", sans-serif'
                        textAlign="center"
                      >
                        No price data available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>

        {/* Timestamp */}
        <Box mb={3}>
          <Typography sx={sectionLabelStyle}>Timestamp</Typography>
          <Typography
            sx={{
              color: "#fff",
              fontSize: "16px",
              fontFamily: '"SF Pro", sans-serif',
              fontWeight: 600,
            }}
          >
            {txnData.timestamp
              ? moment(Math.floor(Number(txnData.timestamp) / 1000)).format(
                  "MM/DD/YYYY hh:mm:ss.SSS",
                )
              : "-"}
          </Typography>
        </Box>

        {/* Transaction Data Accordion - JSON */}
        <Accordion
          sx={{
            backgroundColor: "transparent",
            backgroundImage: "none",
            boxShadow: "none",
            "&:before": {display: "none"},
            "& .MuiAccordionSummary-root": {
              padding: 0,
              minHeight: "40px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              flexDirection: "row",
              "&.Mui-expanded": {
                minHeight: "40px",
              },
            },
            "& .MuiAccordionSummary-content": {
              margin: 0,
              "&.Mui-expanded": {
                margin: 0,
              },
            },
            "& .MuiAccordionDetails-root": {
              padding: "16px 0",
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{color: "rgba(255,255,255,0.4)", fontSize: "18px"}}
              />
            }
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              Transaction Data
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <JsonViewCard
              data={priceUpdate || {}}
              hideBackground={true}
              collapsedByDefault={false}
            />
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Hash Info Section */}
      <ContentBox>
        <ContentRow
          title="State Change Hash:"
          value={txnData.state_change_hash || "-"}
          tooltip={getLearnMoreTooltip("state_change_hash")}
        />
        <ContentRow
          title="Event Root Hash:"
          value={txnData.event_root_hash || "-"}
          tooltip={getLearnMoreTooltip("event_root_hash")}
        />
        <ContentRow
          title="Accumulator Root Hash:"
          value={txnData.accumulator_root_hash || "-"}
          tooltip={getLearnMoreTooltip("accumulator_root_hash")}
        />
      </ContentBox>
    </Box>
  );
}
