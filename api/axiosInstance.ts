import axios from "axios";

// const apiBaseUrl = process.env.REACT_NATIVE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: "http://10.0.2.2:3000",
});

export default axiosInstance;
