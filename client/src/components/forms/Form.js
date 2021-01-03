import React from "react";
import "../../App.css"

// Render form with styles
function Form({ children, ...props }) {

  return (
    <form className="out-box" noValidate {...props}>
      {children}
    </form>
  );
}

export default Form;
