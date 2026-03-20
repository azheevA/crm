import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const apiInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
interface PromiseWithCancel<T> extends Promise<T> {
  cancel?: () => void;
}
export const createInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise: PromiseWithCancel<T> = apiInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then((r) => r.data);
  promise.cancel = () => {
    source.cancel("Запрос был удален");
  };
  return promise;
};

export type BodyType<Data> = Data;
export type ErrorType<Error> = AxiosError<Error>;
