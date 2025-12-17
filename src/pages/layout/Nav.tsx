import React from "react";
import {NavLink} from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import {useAugmentToWithGlobalSearchParams} from "../../routing";

function NavButton({
  to,
  title,
  label,
}: {
  to: string;
  title: string;
  label: string;
}) {
  const augumentToWithGlobalSearchParams = useAugmentToWithGlobalSearchParams();

  return (
    <NavLink
      to={augumentToWithGlobalSearchParams(to)}
      style={{textDecoration: "none", color: "inherit"}}
    >
      {({isActive}) => (
        <Button
          variant="nav"
          title={title}
          style={{
            color: isActive ? "#CDB9F9" : "#999999",
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: '"SF Pro", sans-serif',
            textTransform: "none",
            minWidth: "auto",
            padding: 0,
          }}
          disableRipple
        >
          {label}
        </Button>
      )}
    </NavLink>
  );
}

export default function Nav() {
  return (
    <Box
      sx={{
        display: {xs: "none", md: "flex"},
        alignItems: "center",
        gap: 4, // 32px
      }}
    >
      <NavButton
        to="/transactions"
        title="View All Transactions"
        label="Transactions"
      />
      <NavButton
        to="/validators"
        title="View All Validators"
        label="Validators"
      />
      <NavButton to="/blocks" title="View Latest Blocks" label="Blocks" />
    </Box>
  );
}
