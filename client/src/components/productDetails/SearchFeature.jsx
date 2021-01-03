import React, { useState } from "react";
import { Input } from "antd";
const { Search } = Input;

/**
 * Component - SearchFeature
 * @component
 * @param {Object} props - Object containes updateSearchValues function 
 */
function SearchFeature(props) {
  const [SearchValue, setSearchValue] = useState("");

  /**
   * Pass search input value to father component
   * @event e {onChange} 
   * @see updateSearchValues
   */
  const onChangeSearch = (e) => {
    setSearchValue(e.target.value);

    props.updateSearchValues(e.target.value);
  };

  return (
  
      <Search
        style={{ width: "100%" }}
        size="large"
        value={SearchValue}
        onChange={onChangeSearch}
        placeholder="Search..."
      />
 
  );
}

export default SearchFeature;
