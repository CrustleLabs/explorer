import React from "react";
import {Box, Container, Grid, Stack, Typography, useTheme} from "@mui/material";
import GithubLogo from "../../assets/github.svg?react";
import DiscordLogo from "../../assets/discord.svg?react";
import TwitterLogo from "../../assets/twitter.svg?react";
import MediumLogo from "../../assets/medium.svg?react";
import LinkedInLogo from "../../assets/linkedin.svg?react";
import {grey} from "../../themes/colors/aptosColorPalette";
import SvgIcon from "@mui/material/SvgIcon";
import Logo from "../../assets/logo-dark.svg";
import {Link} from "../../routing";
import FooterDecoration from "./FooterDecoration";

const socialLinks = [
  {title: "Git", url: "https://github.com/CrustleLabs", icon: GithubLogo},
  {
    title: "Discord",
    url: "",
    icon: DiscordLogo,
  },
  {title: "Twitter", url: "", icon: TwitterLogo},
  {title: "Medium", url: "", icon: MediumLogo},
  {
    title: "LinkedIn",
    url: "",
    icon: LinkedInLogo,
  },
];

const footerSections = [
  {
    title: "Company",
    links: [
      {label: "About Us", href: "#"},
      {label: "Careers", href: "#"},
      {label: "Brand Kit", href: "#"},
      {label: "Blog", href: "#"},
    ],
  },
  {
    title: "Product",
    links: [
      {label: "Download", href: "#"},
      {label: "Trade", href: "#"},
      {label: "Documentation", href: "#"},
      {label: "App Feedback", href: "#"},
    ],
  },
  {
    title: "Support",
    links: [
      {label: "Customer Support", href: "#"},
      {label: "FAQs", href: "#"},
      {label: "Contact Us", href: "#"},
    ],
  },
  {
    title: "Regulatory",
    links: [
      {label: "Terms of Use", href: "https://aptoslabs.com/terms"},
      {label: "Privacy Policy", href: "https://aptoslabs.com/privacy"},
    ],
  },
];

export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        background: "transparent",
        color: isDark ? "#CCC" : grey[900],
        pt: 8,
        mt: 8,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: {xs: "95%", md: "70%"},
          "@media (min-width: 1920px)": {
            width: "62.5%",
          },
          mx: "auto",
          px: "0 !important",
        }}
      >
        <Grid container spacing={4} justifyContent="space-between">
          {/* Left Column */}
          <Grid size={{xs: 12, md: 3}}>
            <Stack spacing={4}>
              {/* Logo */}
              <Link to="/" color="inherit" underline="none">
                <Box
                  component="img"
                  src={Logo}
                  alt="Settle Explorer"
                  sx={{height: "40px", width: "auto", display: "block"}}
                />
              </Link>
              {/* Social Icons */}
              <Stack direction="row" spacing={2}>
                {socialLinks.map((link) => (
                  <Link
                    key={link.title}
                    to={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.title}
                    sx={{
                      color: isDark ? "#999" : grey[600],
                      "&:hover": {color: isDark ? "#FFF" : grey[900]},
                      display: "block",
                      lineHeight: 0,
                    }}
                  >
                    <SvgIcon
                      component={link.icon}
                      inheritViewBox
                      sx={{fontSize: 24}}
                    />
                  </Link>
                ))}
              </Stack>
              {/* Copyright */}
              <Typography
                sx={{
                  color: isDark ? "#666" : grey[500],
                  fontSize: "12px",
                  lineHeight: "16px",
                  fontFamily: '"SF Pro", system-ui, sans-serif',
                }}
              >
                Copyright © {new Date().getFullYear()} settle.xyz
              </Typography>
            </Stack>
          </Grid>

          {/* Right Columns (Links) */}
          <Grid size={{xs: 12, md: 9}}>
            <Grid container spacing={4} justifyContent={{md: "flex-end"}}>
              {footerSections.map((section) => (
                <Grid size={{xs: 6, sm: 3}} key={section.title}>
                  <Stack spacing={2}>
                    <Typography
                      sx={{
                        color: isDark ? "#fff" : grey[700],
                        fontSize: "16px",
                        fontWeight: 700,
                        fontFamily: '"Sora", sans-serif',
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Stack spacing={1.5}>
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          sx={{
                            color: isDark ? "#CCC" : grey[600],
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "18px",
                            fontFamily: '"SF Pro", system-ui, sans-serif',
                            textDecoration: "none",
                            "&:hover": {
                              color: isDark ? "#FFF" : grey[900],
                            },
                          }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Typography
          sx={{
            mt: "60px",
            color: "#666",
            fontFamily: '"SF Pro Rounded", "SF Pro", system-ui, sans-serif',
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "22px", // 157.143%
          }}
        >
          Global Markets tokens provide their holders with economic exposure to
          the value of their underlying publicly traded assets, including the
          value of dividends (less applicable tax withholdings). However, the
          Tokens are not themselves stocks or ETFs, and they do not provide
          their holders with rights to hold or receive their respective
          underlying assets.
        </Typography>
      </Container>
      <FooterDecoration />
    </Box>
  );
}
