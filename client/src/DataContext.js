 import React, { createContext, useState, useContext } from "react";

 // Create new context for signup data
const DataContext = createContext();

/**
 * Global signup wizard data caching
 */
function DataProvider({ children }) {
  const [data, setData] = useState({});
  // Add new values to previous data
  const setValues = (values) => {
    setData((prevData) => ({
      ...prevData,
      ...values,
    }));
  };

  return (
    <DataContext.Provider value={{ data, setValues }}>
      {children}
    </DataContext.Provider>
  );
}
/**
 * Create custom hook
 * @returns - DataContext
 */ 
export const useData = () => useContext(DataContext);

export default DataProvider;
