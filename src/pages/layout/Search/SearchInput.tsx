import React from "react";
import {
  AutocompleteRenderInputParams,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps extends AutocompleteRenderInputParams {
  loading?: boolean;
}

export default function SearchInput({loading, ...params}: SearchInputProps) {
  return (
    <form style={{width: "100%", height: "48px"}}>
      <TextField
        {...params}
        variant="outlined"
        sx={{
          height: "100%", // Ensure root takes full form height
          "& .MuiOutlinedInput-root": {
            borderRadius: "100px",
            height: "100%", // Explicitly inherit height
            paddingRight: "12px", // Adjust padding
            "& fieldset": {
              borderColor: "#CDB9F9",
            },
            "&:hover fieldset": {
              borderColor: "#CDB9F9",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#CDB9F9",
              borderWidth: "1px", // Prevent thickening on focus if desired
            },
          },
          "& .MuiInputBase-input": {
            color: "#fff",
            fontSize: "14px",
            fontFamily: '"SF Pro", system-ui, sans-serif',
            padding: "0 !important",
            height: "100%",
          },
        }}
        slotProps={{
          input: {
            ...params.InputProps,
            "aria-label": "search",
            startAdornment: (
              <InputAdornment position="start" sx={{ml: 1, mr: 0}}>
                <SearchIcon sx={{color: "#fff", fontSize: "24px"}} />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} color="inherit" />
              </InputAdornment>
            ),
          },
        }}
        placeholder="Search Explorer"
        fullWidth
      />
    </form>
  );
}
