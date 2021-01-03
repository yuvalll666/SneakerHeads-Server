import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";

function Confirmation() {
  const history = useHistory();
  const { addToast } = useToasts();

  /**
   * On page load move to Sign in page
   */
  useEffect(() => {
    addToast("User have been confirmed!", { appearance: "success" });
    history.push("/signin");
  }, []);

  return null;
}

export default Confirmation;
