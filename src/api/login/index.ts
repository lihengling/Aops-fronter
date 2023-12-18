import request from '@/axios'
import type { UserLoginType, UserType } from './types'

export const loginApi = (data: UserLoginType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/api/user/login/', data })
}
