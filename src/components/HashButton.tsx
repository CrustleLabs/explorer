import React, {useState} from "react";
import {
  Box,
  BoxProps,
  Button,
  Typography,
  useTheme,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  codeBlockColor,
  codeBlockColorClickableOnHover,
  primary,
} from "../themes/colors/aptosColorPalette";
import {
  isValidAccountAddress,
  truncate,
  truncateAddress,
  truncateAddressMiddle,
} from "../pages/utils";
import {
  assertNever,
  isEvmCompatible,
  standardizeAddress,
  tryStandardizeAddress,
  convertToEvmAddressIfNeeded,
} from "../utils";
import {useGetNameFromAddress} from "../api/hooks/useGetANS";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CopyIcon from "../assets/svg/copy_icon.svg?react";
import IdenticonImg from "./IdenticonImg";
import {Link} from "../routing";
import {useGetCoinList, CoinDescription} from "../api/hooks/useGetCoinList";

export enum HashType {
  ACCOUNT = "account",
  TRANSACTION = "transaction",
  OBJECT = "object",
  COIN = "coin",
  FUNGIBLE_ASSET = "fungible_asset",
  OTHERS = "others",
}

function getHashLinkStr(input: string, type: HashType): string {
  switch (type) {
    case HashType.ACCOUNT:
      return `/account/${input}`;
    case HashType.TRANSACTION:
      return `/txn/${input}`;
    case HashType.OBJECT:
      return `/object/${input}`;
    case HashType.COIN:
      return `/coin/${input}`;
    case HashType.FUNGIBLE_ASSET:
      return `/fungible_asset/${input}`;
    case HashType.OTHERS:
      return "";
    default:
      return assertNever(type);
  }
}

interface HashButtonProps extends BoxProps {
  hash: string;
  type: HashType;
  size?: "small" | "large";
  isValidator?: boolean;
  img?: string;
}

interface AccountHashButtonInnerProps extends BoxProps {
  hash: string;
  type: HashType;
  size?: "small" | "large";
  isValidator: boolean;
}

function AccountHashButtonInner({
  hash,
  type,
  size = "small",
  isValidator,
}: AccountHashButtonInnerProps) {
  // Safely standardize address, fallback to original hash if invalid
  const standardizedAddress = tryStandardizeAddress(hash) ?? hash;
  const evmAddress = isEvmCompatible(standardizedAddress)
    ? convertToEvmAddressIfNeeded(standardizedAddress)
    : null;
  const address = standardizedAddress;

  const name = useGetNameFromAddress(address, false, isValidator);
  const truncateHash =
    size === "large"
      ? truncateAddressMiddle(evmAddress ?? address)
      : truncateAddress(evmAddress ?? address);
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const copyAddress = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await navigator.clipboard.writeText(evmAddress ?? address);
    setCopyTooltipOpen(true);
    setTimeout(() => {
      setCopyTooltipOpen(false);
    }, 2000);
  };

  return (
    <Link
      to={getHashLinkStr(evmAddress ?? address, type)}
      sx={{
        backgroundColor: "rgba(182,146,244,0.16)",
        border: "0.5px solid rgba(217,203,251,0.12)",
        "&:hover": {
          backgroundColor: codeBlockColorClickableOnHover,
        },
        color: "#FFF",
        padding: "4px 4px 4px 4px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        borderRadius: "100px",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IdenticonImg address={evmAddress ?? address} />
      </Box>
      <Tooltip
        title={name ?? evmAddress ?? address}
        enterDelay={500}
        enterNextDelay={500}
      >
        <span style={{color: "#fff", fontSize: "14px"}}>
          {name ? truncate(name, 9, 11, "…") : truncateHash}
        </span>
      </Tooltip>
      <Tooltip title="Copied" open={copyTooltipOpen}>
        <Button
          sx={{
            color: "inherit",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.8,
            },
            padding: "0",
            minWidth: "unset", // remove minimum width
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={copyAddress}
          size="small"
        >
          <CopyIcon
            width={16}
            height={16}
            style={{opacity: "0.75", margin: 0, display: "block"}}
          />
        </Button>
      </Tooltip>
    </Link>
  );
}

interface HashButtonInnerProps extends BoxProps {
  label?: string;
  hash: string;
  type: HashType;
  size?: "small" | "large";
  img?: string;
}

function HashButtonInner({
  label,
  hash,
  type,
  size = "small",
  img,
  ...props
}: HashButtonInnerProps) {
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);

  const imgIsEmoji = img && img.match(/^\p{Emoji}+$/u);

  const truncateHash =
    size === "large" ? truncateAddressMiddle(hash) : truncateAddress(hash);

  let icon = null;
  if (img && imgIsEmoji) {
    icon = (
      <Box component="span" sx={{mr: 1, display: "flex", alignItems: "center"}}>
        {img}
      </Box>
    );
  } else if (img) {
    icon = (
      <Box component="span" sx={{mr: 1, display: "flex", alignItems: "center"}}>
        <img src={img} alt={img} height={20} width={20} />
      </Box>
    );
  }

  const copyAddress = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(hash);
    setCopyTooltipOpen(true);
    setTimeout(() => {
      setCopyTooltipOpen(false);
    }, 2000);
  };

  const buttonContent = (
    <Button
      sx={{
        textTransform: "none",
        backgroundColor: "rgba(182,146,244,0.16)",
        border: "0.5px solid rgba(217,203,251,0.12)",
        display: "flex",
        borderRadius: "100px",
        color: "#FFF",
        padding: "4px 4px 4px 4px",
        "&:hover": {
          backgroundColor: codeBlockColorClickableOnHover,
        },
        minWidth: "unset",
      }}
      variant="contained"
    >
      {/* Identicon-like placeholder or icon if exists (mimicking Account structure but kept simple if no icon) */}
      {icon ? (
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 0.5,
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Typography
        variant="body2"
        sx={{mx: 0.5, fontSize: "14px", fontFamily: '"SF Pro", sans-serif'}}
      >
        {label ? label : truncateHash}
      </Typography>

      {/* Copy Button inside */}
      <Tooltip title="Copied" open={copyTooltipOpen}>
        <Button
          sx={{
            color: "inherit",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.8,
            },
            padding: "0",
            minWidth: "unset",
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={copyAddress}
          size="small"
        >
          <CopyIcon
            width={16}
            height={16}
            style={{opacity: "0.75", margin: 0, display: "block"}}
          />
        </Button>
      </Tooltip>
    </Button>
  );

  return (
    <Box {...props} component="span">
      {/* Outer Tooltip for Full Hash on Hover */}
      <Tooltip
        title={hash}
        enterDelay={500}
        enterNextDelay={500}
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "#2e2d32",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "12px",
              fontFamily: '"SF Pro", sans-serif',
              color: "#FFF",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.5)",
              maxWidth: "none",
              whiteSpace: "nowrap",
            },
          },
        }}
      >
        {/* If type is TRANSACTION, wrap in Link, otherwise just button */}
        {type === HashType.TRANSACTION ? (
          <Link to={`/txn/${hash}`} underline="none">
            {buttonContent}
          </Link>
        ) : (
          buttonContent
        )}
      </Tooltip>
    </Box>
  );
}

interface AssetHashButtonInnerProps extends BoxProps {
  hash: string;
  type: HashType;
  size?: "small" | "large";
  img?: string;
}

function AssetHashButtonInner({
  hash,
  type,
  size = "small",
  img,
}: AssetHashButtonInnerProps) {
  const {data: coinData} = useGetCoinList();
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const theme = useTheme();

  const legitCoin: CoinDescription | undefined = coinData?.data?.find(
    (coin: CoinDescription) => {
      const unverified = !coin.panoraTags.some((tag) => tag === "Verified");
      if (unverified) {
        return false;
      }
      if (type === HashType.COIN) {
        return coin.tokenAddress === hash;
      } else {
        return coin.faAddress === hash;
      }
    },
  );

  let coinName = hash;
  if (isValidAccountAddress(hash)) {
    coinName = standardizeAddress(hash);
  }
  const displayName = legitCoin
    ? size === "large"
      ? `${legitCoin.name} (${legitCoin.panoraSymbol ?? legitCoin.symbol})`
      : `${legitCoin.panoraSymbol ?? legitCoin.symbol}`
    : size === "large"
      ? truncateAddressMiddle(coinName)
      : truncateAddress(coinName);

  const copyAddress = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await navigator.clipboard.writeText(coinName);
    setCopyTooltipOpen(true);
    setTimeout(() => {
      setCopyTooltipOpen(false);
    }, 2000);
  };

  const imgIsEmoji = img && img.match(/^\p{Emoji}+$/u);
  let icon = null;
  if (img && imgIsEmoji) {
    icon = (
      <Box component="span" sx={{mr: 1, display: "flex", alignItems: "center"}}>
        {img}
      </Box>
    );
  } else if (img) {
    icon = (
      <Box component="span" sx={{mr: 1, display: "flex", alignItems: "center"}}>
        <img src={img} height={20} width={20} />
      </Box>
    );
  } else if (legitCoin?.logoUrl) {
    icon = (
      <Box component="span" sx={{mr: 1, display: "flex", alignItems: "center"}}>
        <img src={legitCoin.logoUrl} height={20} width={20} />
      </Box>
    );
  }

  return (
    <Stack direction="row" alignItems={"center"} spacing={1}>
      {icon}
      <Link
        to={getHashLinkStr(coinName, type)}
        sx={{
          backgroundColor: codeBlockColor,
          "&:hover": {
            backgroundColor: codeBlockColorClickableOnHover,
          },
          color: "#FFF",
          padding: "0.15rem 0.35rem 0.15rem 1rem",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          borderRadius: 50,
          textDecoration: "none",
        }}
      >
        <Tooltip title={displayName} enterDelay={500} enterNextDelay={500}>
          <span>{displayName}</span>
        </Tooltip>
        <Tooltip title="Copied" open={copyTooltipOpen}>
          <Button
            sx={{
              color: "inherit",
              "&:hover": {
                backgroundColor: `${
                  theme.palette.mode === "dark" ? primary[700] : primary[100]
                }`,
                color: `${
                  theme.palette.mode === "dark" ? primary[100] : primary[600]
                }`,
              },
              padding: "0.25rem 0.5rem 0.25rem 0.5rem",
              margin: "0 0 0 0.2rem",
              minWidth: "unset",
              borderRadius: 50,
            }}
            onClick={copyAddress}
            endIcon={
              <ContentCopyIcon sx={{opacity: "0.75", mr: 1}} fontSize="small" />
            }
            size="small"
          />
        </Tooltip>
      </Link>
    </Stack>
  );
}

export default function HashButton({
  hash,
  type,
  size = "small",
  isValidator = false,
  img,
  ...props
}: HashButtonProps) {
  if (type === HashType.ACCOUNT || type === HashType.OBJECT) {
    return (
      <AccountHashButtonInner
        hash={hash}
        type={type}
        size={size}
        isValidator={isValidator}
        {...props}
      />
    );
  } else if (type === HashType.COIN || type === HashType.FUNGIBLE_ASSET) {
    return (
      <AssetHashButtonInner
        hash={hash}
        type={type}
        size={size}
        img={img}
        {...props}
      />
    );
  } else {
    return (
      <HashButtonInner
        hash={hash}
        type={type}
        size={size}
        img={img}
        {...props}
      />
    );
  }
}
