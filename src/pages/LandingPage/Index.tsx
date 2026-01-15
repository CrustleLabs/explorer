import Box from "@mui/material/Box";

import UserTransactionsPreview from "./UserTransactionsPreview";
import {usePageMetadata} from "../../components/hooks/usePageMetadata";
import NetworkInfoSection from "./NetworkInfoSection";
import HeroSection from "./HeroSection";
import OpenSourcePromo from "./OpenSourcePromo";
import FadeIn from "../../components/FadeIn";

export default function LandingPage() {
  usePageMetadata({});
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* Hero Section with gradient title and stats */}
      <FadeIn delay={0} duration={400}>
        <HeroSection />
      </FadeIn>

      {/* Network Info (Stats) Section */}
      <FadeIn delay={100} duration={400}>
        <NetworkInfoSection />
      </FadeIn>

      {/* Transactions Preview */}
      <FadeIn delay={200} duration={400}>
        <UserTransactionsPreview />
      </FadeIn>

      {/* Open Source / Code Promo */}
      <FadeIn delay={300} duration={400}>
        <OpenSourcePromo />
      </FadeIn>
    </Box>
  );
}
