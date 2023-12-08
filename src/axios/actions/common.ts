import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const axiosInstance = axios.create({ baseURL });

export default axiosInstance;
