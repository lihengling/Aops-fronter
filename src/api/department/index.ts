import request from '@/axios'

export const getDepartmentListApi = (
  page: PageParams = {},
  query: QueryParams = {}
): Promise<IResponse<DepartmentListResponse[]>> => {
  const data = Object.assign({}, query, page)
  return request.get({ url: '/api/department/list', data })
}

export const updateDepartmentApi = (data: DepartmentUpdateRequest | Record<string, any>) => {
  return request.put({ url: '/api/department/', data })
}

export const createDepartmentApi = (
  data: DepartmentCreateRequest | Record<string, any>
): Promise<IResponse<DepartmentBase>> => {
  return request.post({ url: '/api/department/', data })
}

export const deleteDepartmentApi = (data: PrimaryKey): Promise<IResponse<DepartmentBase>> => {
  return request.delete({ url: '/api/department/', data })
}
