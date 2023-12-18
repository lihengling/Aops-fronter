import request from '@/axios'
import { UserParams, UserRoute } from './types'

export const getUserInfoApi = (
  params: UserParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/api/user/info/', params })
}

export const getUserMenuApi = (params: UserParams): Promise<IResponse<UserRoute>> => {
  return request.get({ url: '/api/user/menu/', params })
}
