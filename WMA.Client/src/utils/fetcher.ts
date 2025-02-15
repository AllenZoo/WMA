import { fetchAccessToken } from "@/stores/keys.store";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

//@ts-ignore
const SERVICE_HOST = process.env.EXPO_PUBLIC_SERVICE_HOST || "localhost";
const baseURL = `http://${SERVICE_HOST}:8080/api/v1` || "";

const api = axios.create({
  baseURL,
});

const _retrieveConfigCredentials = async (
  config: InternalAxiosRequestConfig<any>
) => {
  try {
    const credentials = await fetchAccessToken();
    //console.log("creds:", credentials);
    if (credentials !== null) {
      // NOTE: accessToken parsed will = undefined so don't uncomment this.
      // const { accessToken } = JSON.parse(credentials) as Claims;
      // console.log("accessToken: ", accessToken);
      // TODO: eventually uncomment this and see why it's not working
      // config.headers.Authorization = `Bearer ${credentials}`;
      // console.log("config: ", config);
    }
  } catch (error) {
    console.log(error);
  }
  return config;
};

const getConfigWithHeaders = async (
  config: InternalAxiosRequestConfig<any>
) => {
  config.headers["content-type"] = "application/json";
  return _retrieveConfigCredentials(config);
};

api.interceptors.request.use(
  (config) => getConfigWithHeaders(config),
  (error) => {
    return Promise.reject(error);
  }
);

export { api, AxiosError, AxiosResponse };
