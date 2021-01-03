import { useEffect } from "react";
import { logout } from "../services/userService";

/**
 * Component - Logout page
 * @component
 */
function Logout() {
  /**
   * On page load logout user
   * @see logout
   */
  useEffect(() => {
    logout();
    // Move to Signin page
    window.location = "/signin";
  }, []);

  return null;
}

export default Logout;
