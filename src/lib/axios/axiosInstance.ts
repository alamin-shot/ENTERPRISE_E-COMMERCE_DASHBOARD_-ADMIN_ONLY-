import axios from "axios";
import { API_BASE } from "@/lib/constants/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

export default axiosInstance;
