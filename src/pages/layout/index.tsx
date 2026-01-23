import React, {Suspense} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Header from "./Header";
import Footer from "./Footer";
import {Fallback} from "./Fallback";
import {
  GlobalStateProvider,
  useGlobalState,
} from "../../global-config/GlobalConfig";
import {ProvideColorMode} from "../../context";
import {GraphqlClientProvider} from "../../api/hooks/useGraphqlClient";
import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";
import {DexDataPreloader} from "../../api/hooks/DexDataPreloader";
import polkaDots from "../../assets/polka_dots.png";

import {hiddenNetworks} from "../../constants";

const AptosConnectId = "99d260d0-c69d-4c15-965f-f6f9b7b00102";

function ExplorerWalletAdapterProvider({children}: LayoutProps) {
  const [state] = useGlobalState();

  let networkName = state.network_name;
  if (hiddenNetworks.includes(networkName)) {
    // Other networks cause issues with the wallet adapter, so for now we can pretend it's local
    networkName = "local";
  }
  return (
    <AptosWalletAdapterProvider
      key={networkName}
      autoConnect={true}
      dappConfig={{
        aptosConnectDappId: AptosConnectId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        network: networkName as any,
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function ExplorerLayout({children}: LayoutProps) {
  return (
    <ProvideColorMode>
      <CssBaseline />
      <GlobalStateProvider>
        <ExplorerWalletAdapterProvider>
          <GraphqlClientProvider>
            <DexDataPreloader />
            <Box
              component="main"
              sx={{
                minHeight: "100vh",
                background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(155, 89, 182, 0.15) 0%, transparent 50%), #000`,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowX: "hidden", // 防止波点背景导致水平滚动
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "1920px",
                  height: "725px",
                  backgroundImage: `url(${polkaDots})`,
                  backgroundSize: "1920px 725px", // 2x图显示为一半尺寸
                  backgroundPosition: "top center",
                  backgroundRepeat: "no-repeat",
                  pointerEvents: "none",
                  zIndex: 0,
                },
              }}
            >
              <Header />
              <Container
                maxWidth={false}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 4,
                  paddingTop: "7rem", // 5rem header + 2rem spacing
                  paddingBottom: "calc(100px + env(safe-area-inset-bottom))", // Spacing for fixed footer
                  width: {xs: "95%", md: "70%"},
                  "@media (min-width: 1920px)": {
                    width: "1200px",
                  },
                  mx: "auto",
                  px: "0 !important",
                }}
              >
                <Suspense fallback={<Fallback />}>{children}</Suspense>
              </Container>
              <Footer />
            </Box>
          </GraphqlClientProvider>
        </ExplorerWalletAdapterProvider>
      </GlobalStateProvider>
    </ProvideColorMode>
  );
}
