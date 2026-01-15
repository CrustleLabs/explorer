import {PropsWithChildren} from "react";
import {SxProps, TableRow, useTheme} from "@mui/material";
import {useNavigate} from "../../routing";

export default function GeneralTableRow({
  to,
  ...props
}: PropsWithChildren<{
  to?: string;
  onClick?: () => void;
}>) {
  const theme = useTheme();
  const navigate = useNavigate();
  const clickDisabled = !to && !props.onClick;

  const sx: SxProps = {
    textDecoration: "none",
    cursor: clickDisabled ? undefined : "pointer",
    userSelect: "none",
    backgroundColor: "transparent",
    "&:hover:not(:active)": clickDisabled
      ? undefined
      : {
          filter: `${
            theme.palette.mode === "dark"
              ? "brightness(0.9)"
              : "brightness(0.99)"
          }`,
        },
    "&:active": clickDisabled
      ? undefined
      : {
          background: theme.palette.neutralShade.main,
          transform: "translate(0,0.1rem)",
        },
  };

  const handleRowClick = () => {
    if (to) {
      navigate(to);
    }
    if (props.onClick) {
      props.onClick();
    }
  };

  return <TableRow onClick={handleRowClick} sx={sx} {...props} />;
}
