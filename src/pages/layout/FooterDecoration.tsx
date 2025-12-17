import React, {useRef, useState} from "react";
import {Box} from "@mui/material";
import FooterDecorationSvg from "../../assets/footer_decoration.svg";

export default function FooterDecoration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{
    x: number | string;
    y: number | string;
  }>({
    x: "50%",
    y: "50%",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setMousePos({x: "50%", y: "50%"});
  };

  const xValue =
    typeof mousePos.x === "number" ? `${mousePos.x}px` : mousePos.x;
  const yValue =
    typeof mousePos.y === "number" ? `${mousePos.y}px` : mousePos.y;

  // Mask: visible (black) at center of spotlight, fading to invisible (transparent)
  const maskStyle = `radial-gradient(circle 400px at ${xValue} ${yValue}, black 0%, transparent 70%)`;

  return (
    <Box
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        width: "100%",
        height: "auto",
        mt: 8,
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={FooterDecorationSvg}
        alt="Footer Decoration"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          opacity: 0.8,
          maskImage: maskStyle,
          WebkitMaskImage: maskStyle,
          // Removed transition for mask-position because it conflicts with rapid updates
          // and css mask-image transition support is inconsistent.
        }}
      />
    </Box>
  );
}
