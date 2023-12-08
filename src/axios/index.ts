import axiosInstance from "./actions/common";
import { AxiosInstance } from "axios";

const axiosIntercept: AxiosInstance = axiosInstance;
//Request Interceptor
axiosIntercept.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem("token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    config.baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response Interceptor
axiosIntercept.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response?.status) {
        case 401:
          localStorage.clear();
          document.location.href = "/login";
          break;
        case 403:
          localStorage.clear();
          document.location.href = "/login";
          break;
        case 400:
          alert(error.response.data.error.message);
          break;
        default:
          break;
      }
    } else {
      console.log(error);
      // alert(error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosIntercept;
