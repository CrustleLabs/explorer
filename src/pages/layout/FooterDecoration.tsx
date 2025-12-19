import {Box, keyframes} from "@mui/material";
import React from "react";
import footerDecoration from "../../assets/footer_decoration.png";

const spotlightAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) translate(-350px, 0px);
  }
  25% {
    transform: translate(-50%, -50%) translate(350px, 100px);
  }
  50% {
    transform: translate(-50%, -50%) translate(0px, 200px);
  }
  75% {
    transform: translate(-50%, -50%) translate(-350px, 100px);
  }
  100% {
    transform: translate(-50%, -50%) translate(-350px, 0px);
  }
`;

export default function FooterDecoration() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "1200px",
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden", // Restore overflow hidden to prevent scrollbar jitter
        marginTop: "100px",
        zIndex: 0,
        pointerEvents: "none",
        marginX: "auto",
      }}
    >
      {/* Invisible image to reserve space/height */}
      <Box
        component="img"
        src={footerDecoration}
        alt=""
        sx={{
          width: "100%",
          height: "auto",
          opacity: 0,
          visibility: "hidden",
        }}
      />

      {/* Masked Spotlight Layer */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          maskImage: `url(${footerDecoration})`,
          WebkitMaskImage: `url(${footerDecoration})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        {/* Spotlight Effect */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "656.863px",
            height: "658px",
            borderRadius: "658px",
            background: "rgba(217, 203, 251, 0.60)",
            filter: "blur(88.28423309326172px)",
            animation: `${spotlightAnimation} 8s infinite linear`,
            opacity: 0.8,
          }}
        />
      </Box>
    </Box>
  );
}
