import React, {useEffect, useState} from "react";
import {Box, BoxProps} from "@mui/material";

interface FadeInProps extends BoxProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

const FadeIn: React.FC<FadeInProps> = ({
  delay = 0,
  duration = 400,
  children,
  sx,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-in-out`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default FadeIn;
