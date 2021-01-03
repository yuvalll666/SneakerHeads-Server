import React from "react";
import "../../css/PageHeader.css";

function PageHeader({children, props} ) {
  return (
    <div className="header-container mb-4">
      <div className="container">
        <div className="header-title" {...props} > 
          {children}
          </div>
      </div>
    </div>
  );
}

export default PageHeader;
