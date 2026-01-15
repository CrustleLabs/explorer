import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Block,
  BlockMetadataTransactionResponse,
  isBlockMetadataTransactionResponse,
  TransactionResponse,
} from "@aptos-labs/ts-sdk";
import HashButton, {HashType} from "../../../components/HashButton";
import TimestampValue from "../../../components/IndividualPageContent/ContentValue/TimestampValue";
import {Link} from "../../../routing";

const sectionLabelStyle = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "18px",
  mb: 1,
  fontFamily: '"SF Pro", sans-serif',
  fontWeight: 400,
};

function VersionValue({data}: {data: Block}) {
  const {first_version, last_version} = data;

  if (!first_version || !last_version) {
    return <>-</>;
  }

  return (
    <>
      <Link to={`/txn/${first_version}`} underline="none">
        {first_version}
      </Link>
      {" - "}
      <Link to={`/txn/${last_version}`} underline="none">
        {last_version}
      </Link>
    </>
  );
}

export default function BlockOverviewCard({data}: {data: Block}) {
  const blockTxn: TransactionResponse | undefined = (
    data.transactions ?? []
  ).find(isBlockMetadataTransactionResponse);
  const txn = blockTxn as BlockMetadataTransactionResponse | undefined;

  const previousBlock = (BigInt(data.block_height ?? "0") - 1n).toString();
  const nextBlock = (BigInt(data.block_height ?? "0") + 1n).toString();

  // Calculate transaction count safely
  const firstVersion = data.first_version ? BigInt(data.first_version) : 0n;
  const lastVersion = data.last_version ? BigInt(data.last_version) : 0n;
  const transactionCount =
    data.first_version && data.last_version
      ? (lastVersion - firstVersion + 1n).toString()
      : (data.transactions?.length ?? 0).toString();

  return (
    <Box
      sx={{
        backgroundColor: "#16141A",
        border: "0.5px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "24px",
        p: "20px",
      }}
    >
      {/* Block Height */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Block Height</Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          fontFamily='"SF Pro", sans-serif'
          color="#fff"
          fontSize="18px"
        >
          {data.block_height}
        </Typography>
      </Box>

      {/* Transactions */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>
          Transactions [{transactionCount}]
        </Typography>
        <Box sx={{fontSize: "16px", fontFamily: '"SF Pro", sans-serif'}}>
          <VersionValue data={data} />
        </Box>
      </Box>

      {/* Proposer */}
      {txn && (
        <Box mb={3}>
          <Typography sx={sectionLabelStyle}>Proposer</Typography>
          <HashButton hash={txn.proposer} type={HashType.ACCOUNT} />
        </Box>
      )}

      {/* Timestamp */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Timestamp</Typography>
        <TimestampValue timestamp={data.block_timestamp} ensureMilliSeconds />
      </Box>

      {/* Epoch */}
      {txn && (
        <Box mb={3}>
          <Typography sx={sectionLabelStyle}>Epoch</Typography>
          <Typography
            color="#fff"
            fontSize="16px"
            fontFamily='"SF Pro", sans-serif'
          >
            {txn.epoch}
          </Typography>
        </Box>
      )}

      {/* Round */}
      {txn && (
        <Box mb={3}>
          <Typography sx={sectionLabelStyle}>Round</Typography>
          <Typography
            color="#fff"
            fontSize="16px"
            fontFamily='"SF Pro", sans-serif'
          >
            {txn.round}
          </Typography>
        </Box>
      )}

      {/* Previous Block */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Previous Block</Typography>
        <Link to={`/block/${previousBlock}`} underline="none">
          {previousBlock}
        </Link>
      </Box>

      {/* Next Block */}
      <Box mb={3}>
        <Typography sx={sectionLabelStyle}>Next Block</Typography>
        <Link to={`/block/${nextBlock}`} underline="none">
          {nextBlock}
        </Link>
      </Box>

      {/* Data Accordion */}
      <Accordion
        disableGutters
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          "&:before": {display: "none"},
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: "#999"}} />}
          sx={{
            padding: 0,
            minHeight: "auto",
            "& .MuiAccordionSummary-content": {
              margin: 0,
            },
          }}
        >
          <Typography sx={sectionLabelStyle} style={{marginBottom: 0}}>
            Data
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{padding: "8px 0 0 0"}}>
          <Box
            sx={{
              backgroundColor: "#0D0D0D",
              borderRadius: "8px",
              padding: "12px",
              color: "#999",
              fontFamily: "monospace",
              fontSize: "12px",
              wordBreak: "break-all",
            }}
          >
            {/* Render parsed JSON of relevant data if needed, or just some raw info */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
