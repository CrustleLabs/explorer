import {useGlobalState} from "../../global-config/GlobalConfig";
import {useEffect, useState} from "react";
import {Box, Stack, Typography, Link as MuiLink} from "@mui/material";

const footerLinks = [
  {label: "Doc", href: "#"},
  {label: "Support", href: "#"},
  {label: "Terms", href: "https://aptoslabs.com/terms"},
  {label: "Privacy Policy", href: "https://aptoslabs.com/privacy"},
];

export default function Footer() {
  const [state] = useGlobalState();
  const [connectionStatus, setConnectionStatus] = useState<"stable" | "error">(
    "stable",
  );

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await state.aptos_client.getLedgerInfo();
        setConnectionStatus("stable");
      } catch {
        setConnectionStatus("error");
      }
    };

    // Check immediately
    checkConnection();

    // Poll every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [state.aptos_client]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.8)", // Black background to match page base #000
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        // borderTop removed for seamless blend
        pointerEvents: "auto",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)",
        paddingTop: "16px",
        zIndex: 100,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // Responsive padding to match Figma's 240px on large screens but adapt for smaller ones
          px: {xs: 3, md: 6, lg: 10, xl: "240px"},
          pointerEvents: "auto",
        }}
      >
        {/* Connection Badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            backgroundColor:
              connectionStatus === "stable"
                ? "rgba(205, 185, 249, 0.12)"
                : "rgba(255, 97, 97, 0.12)", // Red bg for error
            borderRadius: "38px",
            padding: "2px 6px",
          }}
        >
          <Box
            sx={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor:
                connectionStatus === "stable" ? "#7D6097" : "#FF6161",
              backgroundImage:
                connectionStatus === "stable"
                  ? "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22 viewBox=%220 0 4 4%22 fill=%22none%22%3E%3Ccircle cx=%222%22 cy=%222%22 r=%222%22 fill=%22%23CDB9F9%22/%3E%3C/svg%3E')"
                  : "none",
              backgroundSize: "cover",
            }}
          />
          <Typography
            sx={{
              color: connectionStatus === "stable" ? "#CDB9F9" : "#FF6161",
              fontFamily: '"SF Pro", sans-serif',
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              letterSpacing: 0,
            }}
          >
            {connectionStatus === "stable"
              ? "Stable Connection"
              : "Connection Error"}
          </Typography>
        </Box>

        {/* Right Links */}
        <Stack direction="row" spacing={2} alignItems="center">
          {footerLinks.map((link) => (
            <MuiLink
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              underline="none"
              sx={{
                color: "#999",
                fontFamily: '"SF Pro", sans-serif',
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "16px",
                transition: "color 0.2s",
                "&:hover": {
                  color: "#CDB9F9",
                },
              }}
            >
              {link.label}
            </MuiLink>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
