import axios from "axios";

const baseURL = import.meta.env.VITE_AUTH_BASE_URL || "";

const axiosAuth = axios.create({
  baseURL,
  withCredentials: true, // <-- This is CRITICAL for httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

//
// ⛔️ REMOVED THE INTERCEPTOR ⛔️
//
// We no longer need the interceptor because we are not using
// localStorage tokens. 'withCredentials: true' tells axios
// to allow the browser to send the httpOnly cookie.
//

export default axiosAuth;
