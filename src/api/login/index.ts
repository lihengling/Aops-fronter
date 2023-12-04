import request from '@/config/axios'
import type { UserType } from './types'

interface UserParams {
  item_id: number
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/api/user/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/api/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/user/list', params })
}

export const getUserInfoApi = (
  params: UserParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/api/user', params })
}

export const getUserMenuApi = (
  params: UserParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/api/user/menu/3', params })
}
