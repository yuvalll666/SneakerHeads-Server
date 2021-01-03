import axios from "axios";
import { getJwt } from "./userService";

// Set x-auth-token as default header
axios.defaults.headers.common["x-auth-token"] = getJwt();

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
