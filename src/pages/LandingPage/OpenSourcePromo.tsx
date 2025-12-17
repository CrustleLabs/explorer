import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {useState} from "react";
import OpenSourceGraphic from "../../assets/svg/open_source_promo_graphic.svg?react";
import HoverViewCodeCircle from "../../assets/svg/hover_view_code_circle.svg?react"; // Import new SVG

// Promo card styling
const promoCardSx = {
  backgroundColor: "#16141A",
  borderRadius: "24px",
  border: "0.5px solid rgba(255,255,255,0.06)",
  mt: 3,
  position: "relative",
  overflow: "hidden",
  minHeight: "300px",
  display: "flex",
};

const FlickerWord = ({
  c,
  children,
}: {
  c?: string;
  children: React.ReactNode;
}) => {
  const [style] = useState(() => ({
    color: c || "#a9b7c6",
    animation: `codeFlicker ${0.2 + Math.random() * 0.8}s infinite alternate`,
    animationDelay: `${Math.random()}s`,
  }));

  return (
    <Box component="span" sx={style}>
      {children}
    </Box>
  );
};

const CodeContent = () => (
  <pre style={{margin: 0, fontFamily: "inherit", userSelect: "none"}}>
    <style>
      {`
        @keyframes codeFlicker {
          0% { opacity: 0.15; }
          100% { opacity: 1; }
        }
      `}
    </style>
    <code style={{color: "#a9b7c6"}}>
      <FlickerWord c="#cc7832">import</FlickerWord>{" "}
      <FlickerWord>{"{"}</FlickerWord> <FlickerWord>IOApp,</FlickerWord>
      <FlickerWord>ILayerZeroEndpointV2</FlickerWord>{" "}
      <FlickerWord>{"}"}</FlickerWord>{" "}
      <FlickerWord c="#cc7832">from</FlickerWord>{" "}
      <FlickerWord c="#6a8759">"./interfaces"</FlickerWord>
      <FlickerWord>;</FlickerWord>
      {"\n"}
      <FlickerWord c="#cc7832">import</FlickerWord>{" "}
      <FlickerWord>{"{"}</FlickerWord> <FlickerWord>OAppSender</FlickerWord>{" "}
      <FlickerWord>{"}"}</FlickerWord>{" "}
      <FlickerWord c="#cc7832">from</FlickerWord>{" "}
      <FlickerWord c="#6a8759">"./OAppSender.sol"</FlickerWord>
      <FlickerWord>;</FlickerWord>
      {"\n"}
      <FlickerWord c="#808080">
        // @dev import the origin so its exposed to OApp implement
      </FlickerWord>
      {"\n"}
      <FlickerWord c="#cc7832">import</FlickerWord>{" "}
      <FlickerWord>{"{"}</FlickerWord> <FlickerWord>OAppReceiver,</FlickerWord>{" "}
      <FlickerWord>Origin</FlickerWord> <FlickerWord>{"}"}</FlickerWord>{" "}
      <FlickerWord c="#cc7832">from</FlickerWord>{" "}
      <FlickerWord c="#6a8759">"./OAppReceiver.sol"</FlickerWord>
      <FlickerWord>;</FlickerWord>
      {"\n\n"}
      <FlickerWord c="#cc7832">abstract</FlickerWord>{" "}
      <FlickerWord c="#cc7832">contract</FlickerWord>{" "}
      <FlickerWord>OApp</FlickerWord> <FlickerWord c="#cc7832">is</FlickerWord>{" "}
      <FlickerWord>IOApp, OAppSender, OAppReceiver</FlickerWord>
      {"\n    "}
      <FlickerWord c="#ffc66d">constructor</FlickerWord>
      <FlickerWord>(</FlickerWord>
      <FlickerWord c="#cc7832">address</FlickerWord>{" "}
      <FlickerWord>_endpoint,</FlickerWord>{" "}
      <FlickerWord c="#cc7832">address</FlickerWord>{" "}
      <FlickerWord>_owner)</FlickerWord> <FlickerWord>{"{"}</FlickerWord>
      {"\n        "}
      <FlickerWord c="#9876aa">_transferOwnership</FlickerWord>
      <FlickerWord>(_owner);</FlickerWord>
      {"\n        "}
      <FlickerWord>endpoint</FlickerWord> <FlickerWord>=</FlickerWord>{" "}
      <FlickerWord c="#9876aa">ILayerZeroEndpointV2</FlickerWord>
      <FlickerWord>(_endpoint);</FlickerWord>
      {"\n    "}
      <FlickerWord>{"}"}</FlickerWord>
    </code>
  </pre>
);

export default function OpenSourcePromo() {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Box
      sx={promoCardSx}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setIsTextHovered(false); // Reset text hover just in case
      }}
    >
      {/* Background Code Layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: "13px",
          lineHeight: "1.6",
          p: 4,
          display: "flex", // Enable tiling
          gap: 4, // Space between code blocks
          opacity: isCardHovered ? 1 : 0.1, // Visible when hovering ANYWHERE in card
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Dimmed Background Layer */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            gap: 8,
            p: 4,
            opacity: 0.1,
            filter: "blur(2px)",
            userSelect: "none",
          }}
        >
          <CodeContent />
          <CodeContent />
        </Box>

        {/* Spotlight Layer */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            gap: 8,
            p: 4,
            pointerEvents: "none",
            maskImage: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
          }}
        >
          <CodeContent />
          <CodeContent />
        </Box>
      </Box>

      {/* Graphics Layer (Visible only when NOT hovering) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: {xs: "100%", md: "60%"},
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: isCardHovered ? 0 : 1, // Disappears on hover
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
          zIndex: 5,
          overflow: "hidden", // Ensure zoomed SVG doesn't overflow card if needed
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "translateX(20%) scale(1.3)", // Zoom and shift right
          }}
        >
          {/* Ripples Graphic */}
          <Box
            component={OpenSourceGraphic}
            sx={{
              height: "100%",
              width: "auto",
              color: "#CDB9F9",
            }}
          />

          {/* Center Button (Concentric with Ripples) */}
          <Box
            sx={{
              position: "absolute",
              width: "100px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component={HoverViewCodeCircle}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
            <Box sx={{position: "relative", textAlign: "center", zIndex: 1}}>
              <Typography
                sx={{
                  color: "#CDB9F9",
                  fontSize: "12px",
                  lineHeight: "16px",
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                Hover
              </Typography>
              <Typography
                sx={{
                  color: "#CDB9F9",
                  fontSize: "12px",
                  lineHeight: "16px",
                  fontFamily: '"SF Pro", sans-serif',
                }}
              >
                {"< View Code >"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Foreground Text Layer */}
      <Box
        onMouseEnter={() => setIsTextHovered(true)}
        onMouseLeave={() => setIsTextHovered(false)}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 10,
          width: {md: "298px"},
          p: 4, // 32px padding
          opacity: isTextHovered ? 0 : 1, // Hidden ONLY when hovering TEXT
          transition: "opacity 0.5s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "24px",
              lineHeight: "28px",
              fontWeight: 700,
              fontFamily: '"SF Pro", system-ui, sans-serif',
              mb: "16px", // 16px spacing
              cursor: "default",
            }}
          >
            Declaration
          </Typography>
          <Typography
            sx={{
              color: "#CCC",
              fontSize: "14px",
              lineHeight: "18px",
              fontWeight: 400,
              fontFamily: '"SF Pro", system-ui, sans-serif',
              cursor: "default",
            }}
          >
            Our code is fully open-source and verifiable built entirely for
            transparency and centered around the theme of decentralization
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "#999",
            fontSize: "12px",
            lineHeight: "16px",
            fontWeight: 400,
            fontFamily: '"SF Pro", system-ui, sans-serif',
            cursor: "default",
          }}
        >
          {"< On the Settle chain >"}
        </Typography>
      </Box>
    </Box>
  );
}
