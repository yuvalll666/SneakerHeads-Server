import React, { createContext, useState, useContext } from "react";

// Create new context for deleted user by admin
const DeletedUserContext = createContext();

/**
 * Global deleted use caching
 */
function DeletedUserProvider({ children }) {
  const [DeletedUser, setDeletedUser] = useState({});

  return (
    <DeletedUserContext.Provider value={{ DeletedUser, setDeletedUser }}>
      {children}
    </DeletedUserContext.Provider>
  );
}

/**
 * Create custom hook
 * @returns - Deleted user information
 */ 
export const useDeletedUser = () => useContext(DeletedUserContext);

export default DeletedUserProvider;
