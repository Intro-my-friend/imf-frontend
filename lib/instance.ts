import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = "https://api.anunsai.com";

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const accessToken = window.localStorage.getItem("jwt");
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
