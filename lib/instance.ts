import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = "http://15.164.39.230:8000";

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const accessToken = window.localStorage.getItem("jwt");
    console.log({ accessToken });
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
};

const responseInterceptor = (response: AxiosResponse) => {
  return response.data;
};

export const api = <T>(config: AxiosRequestConfig): Promise<T> => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
  });
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(responseInterceptor);

  return instance(config);
};
