import React, {useRef} from "react";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import NetworkSelect from "./NetworkSelect";
import {useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import Logo from "../../assets/logo.svg";
import Nav from "./Nav";
import NavMobile from "./NavMobile";
import {grey} from "../../themes/colors/aptosColorPalette";
import {useInView} from "react-intersection-observer";
import FeatureBar from "./FeatureBar";
// import {WalletConnector} from "../../components/WalletConnector";
import {useGlobalState} from "../../global-config/GlobalConfig";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {sendToGTM} from "../../api/hooks/useGoogleTagManager";
import {Link} from "../../routing"; // , useNavigate
import {useLogEventWithBasic} from "../Account/hooks/useLogEventWithBasic";
import {addressFromWallet} from "../../utils"; // , sortPetraFirst
import {AccountAddress} from "@aptos-labs/ts-sdk";

export default function Header() {
  const scrollTop = () => {
    const docElement = document.documentElement;
    const windowTop =
      (window.scrollY || docElement.scrollTop) - (docElement.clientTop || 0);

    if (windowTop > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // const {toggleColorMode} = useColorMode();
  const theme = useTheme();
  const logEvent = useLogEventWithBasic();
  const isDark = theme.palette.mode === "dark";

  const {ref, inView} = useInView({
    rootMargin: "-40px 0px 0px 0px",
    threshold: 0,
  });

  // const isOnMobile = !useMediaQuery(theme.breakpoints.up("md"));
  const [state] = useGlobalState();
  const {account, wallet, network} = useWallet();
  // const navigate = useNavigate();
  const walletAddressRef = useRef("");
  const accountAddress = addressFromWallet(account?.address);
  if (
    account &&
    accountAddress &&
    walletAddressRef.current !== accountAddress
  ) {
    logEvent("wallet_connected", accountAddress, {
      wallet_name: wallet!.name,
      network_type: state.network_name,
    });
    sendToGTM({
      dataLayer: {
        event: "walletConnection",
        walletAddress: account.address,
        walletName: wallet?.name,
        network: network?.name,
      },
    });
    walletAddressRef.current = AccountAddress.from(account.address).toString();
  }

  return (
    <>
      <Box
        sx={{
          background: "transparent",
          height: "64px",
          width: "100%",
          position: "absolute",
        }}
        ref={ref}
      ></Box>
      <MuiAppBar
        sx={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          borderRadius: "0",
          // backdropFilter: "blur(10px)", // 临时禁用，测试是否影响滚动性能
          background: "transparent", // Default to transparent at top
          zIndex: 1100, // 确保在其他内容之上
          ...(!inView &&
            isDark && {
              background: "rgba(18,22,21, 0.85)",
              borderBottom: `1px solid ${theme.palette.common}`,
            }),
          ...(!inView &&
            !isDark && {
              background: "rgba(254,254,254, 0.8)",
              borderBottom: `2px solid rgba(18,22,21,0.05)`,
            }),
        }}
      >
        <FeatureBar />
        <Container
          maxWidth={false}
          sx={{
            width: {xs: "95%"},
            "@media (min-width: 1440px)": {
              width: "1200px",
            },
            "@media (min-width: 1920px)": {
              width: "1440px",
            },
            "@media (min-width: 2560px)": {
              width: "1600px",
            },
            mx: "auto",
            display: "flex",
            alignItems: "center",
            px: "0 !important", // Override default padding
          }}
        >
          <Toolbar
            sx={{
              height: "5rem",
              width: "100%",
              color:
                theme.palette.mode === "dark" ? grey[50] : "rgba(18,22,21,1)",
              justifyContent: "space-between",
            }}
            disableGutters
          >
            {/* Left: Logo */}
            <Box sx={{display: "flex", alignItems: "center"}}>
              <Link
                onClick={scrollTop}
                to="/"
                color="inherit"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={Logo}
                  alt="Intention Explorer"
                  sx={{
                    height: "48px",
                    width: "auto",
                    display: "block",
                  }}
                />
              </Link>
            </Box>

            {/* Center: Navigation */}
            <Nav />

            {/* Right: Actions */}
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
              <NetworkSelect />

              {/* <Box
                sx={{
                  width: "1px",
                  height: "20px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
                }}
              /> */}

              <NavMobile />
              {/* {!isOnMobile && (
                <WalletConnector
                  networkSupport={state.network_name}
                  handleNavigate={() =>
                    navigate(`/account/${account?.address}`)
                  }
                  sortInstallableWallets={sortPetraFirst}
                  modalMaxWidth="sm"
                />
              )} */}
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    </>
  );
}
