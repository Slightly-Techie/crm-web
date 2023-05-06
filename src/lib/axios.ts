import axios from "axios";
import { API_URL } from "../constants";

export default axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const axiosAuth = axios.create({
  baseURL: API_URL,
  // headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
