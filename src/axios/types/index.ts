import {
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosError,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders
} from 'axios'

interface AxiosResponse<T = any, D = any> {
  // 自定义响应
  data: T
  code: number
  message: string
  config: InternalAxiosRequestConfig<D>
  request?: any
  total?: number
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
}

interface RequestInterceptors<T> {
  // 请求拦截
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestInterceptorsCatch?: (err: any) => any
  // 响应拦截
  responseInterceptors?: (config: T) => T
  responseInterceptorsCatch?: (err: any) => any
}

interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>
}

export {
  AxiosResponse,
  RequestInterceptors,
  RequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosError
}
