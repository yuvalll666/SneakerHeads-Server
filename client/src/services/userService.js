import { apiUrl } from "../config.json";
import http from "./httpService";
import jwtDecode from "jwt-decode";

const tokenKey = "token";

/**
 * @returns - JWT token that containes user's information from the local storage
 */
export function getJwt() {
  const tokenKey = "token";
  return localStorage.getItem(tokenKey);
}

/**
 * Remove user's JWT token from the local storage
 */
export function logout() {
  localStorage.removeItem(tokenKey);
}

/**
 * @returns {object} - Current logged in user information
 */
export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

/**
 * Set JWT token with user's info from the server to local storage
 * @param {string} email - User's email input value
 * @param {string} password - User's password input value
 */
export async function login(email, password) {
  const { data } = await http.post("/users/login", {
    email,
    password,
  });

  localStorage.setItem(tokenKey, data.token);
}

export default {
  login,
  getCurrentUser,
  logout,
  getJwt,
};
