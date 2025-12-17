import {truncateAddress, useWallet} from "@aptos-labs/wallet-adapter-react";
import {AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon} from "@mui/icons-material";
import {Avatar, Button, Typography} from "@mui/material";
import React, {JSX, useState} from "react";
import WalletMenu from "./WalletMenu";

type WalletButtonProps = {
  handleModalOpen: () => void;
  handleNavigate?: () => void;
};

export default function WalletButton({
  handleModalOpen,
  handleNavigate,
}: WalletButtonProps): JSX.Element {
  const {connected, account, wallet} = useWallet();

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null,
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const onConnectWalletClick = () => {
    handlePopoverClose();
    handleModalOpen();
  };

  return (
    <>
      <Button
        size="large"
        variant="contained"
        onClick={connected ? handleClick : onConnectWalletClick}
        className="wallet-button"
        sx={{
          borderRadius: "100px",
          fontFamily: '"SF Pro", sans-serif',
          textTransform: "none",
          backgroundColor: "#CDB9F9",
          color: "#000000",
          boxShadow: "none",
          fontSize: "12px",
          fontWeight: 500,
          padding: "6px 20px",
          "&:hover": {
            backgroundColor: "#BFA5F5",
            boxShadow: "none",
          },
        }}
      >
        {connected ? (
          <>
            <Avatar
              alt={wallet?.name}
              src={wallet?.icon}
              sx={{width: 24, height: 24}}
            />
            <Typography
              noWrap
              ml={2}
              sx={{fontFamily: '"SF Pro", sans-serif', fontWeight: 600}}
            >
              {account?.ansName ||
                truncateAddress(account?.address?.toString()) ||
                "Unknown"}
            </Typography>
          </>
        ) : (
          <>
            <AccountBalanceWalletOutlinedIcon
              sx={{marginRight: 1, fontSize: "18px"}}
            />
            <Typography
              noWrap
              sx={{
                fontFamily: '"SF Pro", sans-serif',
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "16px",
              }}
            >
              Connect Wallet
            </Typography>
          </>
        )}
      </Button>
      <WalletMenu
        popoverAnchor={popoverAnchor}
        handlePopoverClose={handlePopoverClose}
        handleNavigate={handleNavigate}
      />
    </>
  );
}
