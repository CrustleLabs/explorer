import Box from "@mui/material/Box";

import UserTransactionsPreview from "./UserTransactionsPreview";
import {usePageMetadata} from "../../components/hooks/usePageMetadata";
import NetworkInfoSection from "./NetworkInfoSection";
import HeroSection from "./HeroSection";
import OpenSourcePromo from "./OpenSourcePromo";

export default function LandingPage() {
  usePageMetadata({});
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Hero Section with gradient title and stats */}
      <HeroSection />

      {/* Network Info (Stats) Section */}
      <NetworkInfoSection />

      {/* Transactions Preview */}
      <UserTransactionsPreview />

      {/* Open Source / Code Promo */}
      <OpenSourcePromo />
    </Box>
  );
}
