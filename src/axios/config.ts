import { AxiosResponse, AxiosRequestHeaders, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { NO_AUTHOR_WHITE_LIST, SUCCESS_CODE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  }
  if ((config.method === 'get' || config.method === 'delete') && config.data) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.data)
    for (const key of keys) {
      if (config.data[key] !== void 0 && config.data[key] !== null) {
        url += `${key}=${encodeURIComponent(config.data[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.data = {}
    config.url = url
  }
  if (config.method === 'put') {
    config.headers['Content-Type'] = 'application/json'
    config.params = JSON.stringify(config.params)
    config.params = {}
  }

  if (config.url && !NO_AUTHOR_WHITE_LIST.includes(config.url)) {
    const userStore = useUserStoreWithOut()
    config.headers[userStore.getTokenKey ?? 'Authorization'] = `Bearer ${userStore.getToken}` ?? ''
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === SUCCESS_CODE) {
    return response.data
  } else {
    console.log(response?.data?.message)
    ElMessage.error(response?.data?.message)
    if (response?.data?.code === 401) {
      const userStore = useUserStoreWithOut()
      userStore.logout()
    }
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
