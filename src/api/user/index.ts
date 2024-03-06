import request from '@/axios'

export const getUserListApi = (
  page: PageParams = {},
  query: QueryParams = {}
): Promise<IResponse<UserListResponse[]>> => {
  const data = Object.assign({}, query, page)
  return request.get({ url: '/api/user/list', data })
}

export const updateUserApi = (data: UserUpdateRequest | Record<string, any>) => {
  return request.put({ url: '/api/user/', data })
}

export const createUserApi = (
  data: UserCreateRequest | Record<string, any>
): Promise<IResponse<UserBase>> => {
  return request.post({ url: '/api/user/', data })
}

export const deleteUserApi = (data: PrimaryKey): Promise<IResponse<UserBase>> => {
  return request.delete({ url: '/api/user/', data })
}

export const getUserMenuApi = (data: PrimaryKey): Promise<IResponse> => {
  return request.get({ url: '/api/user/menu/', data })
}
