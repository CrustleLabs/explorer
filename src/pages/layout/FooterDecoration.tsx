import React, {useLayoutEffect, useRef} from "react";
import {Box} from "@mui/material";
import FooterDecorationSvg from "../../assets/footer_decoration.svg";

export default function FooterDecoration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Animation state stored in refs to avoid re-renders
  const animState = useRef({
    x: 50, // Current X %
    y: 50, // Current Y %
    targetX: 50, // Target X %
    targetY: 50, // Target Y %
    speed: 0.1, // Lerp speed (0.05 to 0.2 for smooth movement)
  });
  const requestRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const pickNewTarget = () => {
      // Pick random percentage between 10% and 90% to keep it mostly visible
      animState.current.targetX = 10 + Math.random() * 80;
      animState.current.targetY = 20 + Math.random() * 60; // Keep Y a bit more centered vertically
      // Randomize speed slightly for variety - Reverted to moderate speed
      animState.current.speed = 0.005 + Math.random() * 0.01;
    };

    const animate = () => {
      const state = animState.current;

      // Linear interpolation (Lerp)
      const dx = state.targetX - state.x;
      const dy = state.targetY - state.y;

      // Move towards target
      state.x += dx * state.speed;
      state.y += dy * state.speed;

      // Check if close enough to target to pick a new one
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) {
        pickNewTarget();
      }

      // Apply mask directly to DOM
      if (imgRef.current) {
        const maskStyle = `radial-gradient(circle 400px at ${state.x}% ${state.y}%, black 0%, transparent 70%)`;
        imgRef.current.style.maskImage = maskStyle;
        imgRef.current.style.webkitMaskImage = maskStyle;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    pickNewTarget();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "auto",
        mt: 8,
        overflow: "hidden",
        pointerEvents: "none", // No interaction needed anymore
      }}
    >
      <Box
        ref={imgRef}
        component="img"
        src={FooterDecorationSvg}
        alt="Footer Decoration"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          opacity: 0.8,
          // Initial mask
          maskImage: `radial-gradient(circle 400px at 50% 50%, black 0%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(circle 400px at 50% 50%, black 0%, transparent 70%)`,
          willChange: "mask-image", // Hint for optimization
        }}
      />
    </Box>
  );
}
