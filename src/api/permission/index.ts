import request from '@/axios'

export const getPermissionListApi = (
  page: PageParams = {},
  query: QueryParams = {}
): Promise<IResponse<PermissionListResponse[]>> => {
  const data = Object.assign({}, query, page)
  return request.get({ url: '/api/permission/list', data })
}

export const updatePermissionApi = (data: PermissionUpdateRequest | Record<string, any>) => {
  return request.put({ url: '/api/permission/', data })
}

export const createPermissionApi = (
  data: DepartmentCreateRequest | Record<string, any>
): Promise<IResponse<PermissionBase>> => {
  return request.post({ url: '/api/permission/', data })
}

export const deletePermissionApi = (data: PrimaryKey): Promise<IResponse<PermissionBase>> => {
  return request.delete({ url: '/api/permission/', data })
}
