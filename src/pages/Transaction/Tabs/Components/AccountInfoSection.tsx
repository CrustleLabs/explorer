import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Types} from "aptos";
import {useGetPerpetuals} from "../../../../api/hooks/useGetPerpetuals";
import {useGetDexAccount} from "../../../../api/hooks/useGetDexAccount";
import BtcIcon from "../../../../assets/svg/perps/btc.svg?react";
import EthIcon from "../../../../assets/svg/perps/eth.svg?react";

interface AccountInfoSectionProps {
  transaction: Types.Transaction;
}

const LOGO_MAP: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  BTC: BtcIcon,
  ETH: EthIcon,
};

export default function AccountInfoSection({
  transaction,
}: AccountInfoSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sender = (transaction as any).sender;
  const {data: perpetuals, isLoading: isLoadingPerps} = useGetPerpetuals();
  const {data: dexAccount, isLoading: isLoadingPositions} =
    useGetDexAccount(sender);
  const positions = dexAccount?.positions;

  if (
    !("payload" in transaction) ||
    transaction.payload.type !== "dex_orderless_payload" ||
    isLoadingPerps ||
    !perpetuals
  ) {
    return null;
  }

  // Placeholders from Figma
  const accountValue = 14670.65;
  const positionsValue = 14670.65;
  const withdrawable = 8786.7;

  return (
    <Box>
      {/* Account Metrics */}
      <Stack direction="row" spacing={2} mb={4}>
        <Box sx={{flex: 1}}>
          <Typography
            color="#666"
            display="block"
            mb={0.5}
            fontFamily='"SF Pro", sans-serif'
            fontSize="11px"
            lineHeight="18px"
          >
            Account Value
          </Typography>
          <Typography
            fontWeight={600}
            fontFamily='"SF Pro", sans-serif'
            color="#fff"
            fontSize="16px"
            lineHeight="24px"
          >
            $
            {accountValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
        <Box sx={{flex: 1}}>
          <Typography
            color="#666"
            display="block"
            mb={0.5}
            fontFamily='"SF Pro", sans-serif'
            fontSize="11px"
            lineHeight="18px"
          >
            Positions
          </Typography>
          <Typography
            fontWeight={600}
            fontFamily='"SF Pro", sans-serif'
            color="#fff"
            fontSize="16px"
            lineHeight="24px"
          >
            $
            {positionsValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
        <Box sx={{flex: 1}}>
          <Typography
            color="#666"
            display="block"
            mb={0.5}
            fontFamily='"SF Pro", sans-serif'
            fontSize="11px"
            lineHeight="18px"
          >
            Withdrawable
          </Typography>
          <Typography
            fontWeight={600}
            fontFamily='"SF Pro", sans-serif'
            color="#fff"
            fontSize="16px"
            lineHeight="24px"
          >
            $
            {withdrawable.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      </Stack>

      {/* Active Positions Accordion */}
      <Box>
        <Accordion
          defaultExpanded
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
              padding: "8px 0",
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
              Active Positions
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isLoadingPositions ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <Table
                size="small"
                sx={{"& td, & th": {borderBottom: "none", padding: "10px 0"}}}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontSize: "11px",
                        fontFamily: '"SF Pro", sans-serif',
                        paddingBottom: "4px",
                      }}
                    >
                      Asset
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontSize: "11px",
                        fontFamily: '"SF Pro", sans-serif',
                        paddingBottom: "4px",
                        textAlign: "right",
                      }}
                    >
                      Size
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontSize: "11px",
                        fontFamily: '"SF Pro", sans-serif',
                        paddingBottom: "4px",
                        textAlign: "right",
                      }}
                    >
                      PnL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positions?.map((pos, idx) => {
                    const Icon = LOGO_MAP[pos.symbol];
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {Icon ? (
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Icon width="100%" height="100%" />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  bgcolor: "#fff",
                                }}
                              />
                            )}
                            <Box>
                              <Typography
                                variant="body2"
                                color="#fff"
                                fontFamily='"SF Pro", sans-serif'
                                fontWeight={600}
                                fontSize="13px"
                                lineHeight={1.2}
                              >
                                {pos.symbol}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color:
                                      pos.side === "long"
                                        ? "#03A881"
                                        : "#DC2971",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {pos.side}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="rgba(255,255,255,0.4)"
                                  fontSize="10px"
                                >
                                  {pos.leverage}x
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color="#fff"
                            fontFamily='"SF Pro", sans-serif'
                            fontSize="13px"
                          >
                            {pos.size.toLocaleString(undefined, {
                              maximumFractionDigits: 4,
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color="#03A881"
                            fontFamily='"SF Pro", sans-serif'
                            fontSize="13px"
                          >
                            +$23.50
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!positions || positions.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography
                          color="#666"
                          fontSize="12px"
                          fontFamily='"SF Pro", sans-serif'
                        >
                          No active positions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
