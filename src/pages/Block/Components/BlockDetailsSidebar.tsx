import {Box, Skeleton, Stack, Typography} from "@mui/material";
import {Block, isBlockMetadataTransactionResponse} from "@aptos-labs/ts-sdk";
import HashButton, {HashType} from "../../../components/HashButton";
import TimestampValue from "../../../components/IndividualPageContent/ContentValue/TimestampValue";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CubeIcon from "../../../assets/svg/cube.svg?react";

export default function BlockDetailsSidebar({
  data,
  isLoading,
}: {
  data?: Block;
  isLoading?: boolean;
}) {
  const blockMetadataTxn = data?.transactions?.find(
    isBlockMetadataTransactionResponse,
  );

  // Parse ID (Hash) - usually the block hash or transaction hash
  const blockHash = data?.block_hash;

  return (
    <Box
      sx={{
        backgroundColor: "#16141A",
        borderRadius: "24px",
        border: "0.5px solid rgba(255,255,255,0.12)",
        p: 3,
        height: "fit-content",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#B692F4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CubeIcon />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#fff",
            fontFamily: '"SF Pro", sans-serif',
          }}
        >
          Block Details
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {/* Hash */}
        <Box>
          <Typography
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontFamily: '"SF Pro", sans-serif',
            }}
          >
            Hash
          </Typography>
          {isLoading ? (
            <Skeleton
              variant="rounded"
              height={36}
              sx={{borderRadius: "20px", bgcolor: "rgba(255,255,255,0.08)"}}
            />
          ) : (
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: "20px",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              >
                {blockHash
                  ? `${blockHash.substring(0, 10)}...${blockHash.substring(
                      blockHash.length - 8,
                    )}`
                  : "-"}
              </Typography>
              <ContentCopyIcon
                sx={{fontSize: 16, color: "#999", cursor: "pointer"}}
                onClick={() => {
                  if (blockHash) navigator.clipboard.writeText(blockHash);
                }}
              />
            </Box>
          )}
        </Box>

        {/* Proposer */}
        <Box
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontFamily: '"SF Pro", sans-serif',
            }}
          >
            Proposer
          </Typography>
          {isLoading ? (
            <Skeleton
              variant="rounded"
              width={160}
              height={28}
              sx={{borderRadius: "100px", bgcolor: "#2e2d32"}}
            />
          ) : (
            (() => {
              // User requested: Proposer is taken from the proposer in the data of the event inside the block_metadata_transaction
              // Look for NewBlockEvent specifically (can be 0x1::block::NewBlockEvent or 0x0...1::block::NewBlockEvent)
              const proposerFromEvent = blockMetadataTxn?.events?.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (e: any) => e.type.includes("::block::NewBlockEvent"),
              )?.data?.proposer;

              // Fallback to transaction level proposer if not found in events (though user specificed event)
              const proposer = proposerFromEvent || blockMetadataTxn?.proposer;

              if (!proposer)
                return <Typography color="text.secondary">-</Typography>;

              return (
                <Box
                  sx={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <HashButton hash={proposer} type={HashType.ACCOUNT} />
                </Box>
              );
            })()
          )}
        </Box>

        {/* Timestamp */}
        <Box>
          <Typography
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontFamily: '"SF Pro", sans-serif',
            }}
          >
            Timestamp
          </Typography>
          {isLoading ? (
            <Skeleton variant="text" width={140} sx={{bgcolor: "#2e2d32"}} />
          ) : (
            <Typography
              sx={{
                color: "#fff",
                fontSize: "14px",
                fontFamily: '"SF Pro", sans-serif',
              }}
            >
              {data?.block_timestamp ? (
                <TimestampValue
                  timestamp={data.block_timestamp}
                  ensureMilliSeconds
                />
              ) : (
                "-"
              )}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
