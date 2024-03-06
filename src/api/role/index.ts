import request from '@/axios'

export const getRoleListApi = (
  page: PageParams = {},
  query: QueryParams = {}
): Promise<IResponse<RoleListResponse[]>> => {
  const data = Object.assign({}, query, page)
  return request.get({ url: '/api/role/list', data })
}

export const updateRoleApi = (data: RoleUpdateRequest | Record<string, any>) => {
  return request.put({ url: '/api/role/', data })
}

export const createRoleApi = (
  data: RoleCreateRequest | Record<string, any>
): Promise<IResponse<RoleBase>> => {
  return request.post({ url: '/api/role/', data })
}

export const deleteRoleApi = (data: PrimaryKey): Promise<IResponse<RoleBase>> => {
  return request.delete({ url: '/api/role/', data })
}
