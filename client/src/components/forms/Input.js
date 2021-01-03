import { TextField } from "@material-ui/core";
import React, { forwardRef } from "react";

// Render TextFiled with styles
const Input = forwardRef((props, ref) => {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      inputRef={ref}
      fullWidth
      {...props}
    />
  );
});

export default Input;
