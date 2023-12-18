import request from '@/axios'

export const getMenuListApi = (data: QueryParams): Promise<IResponse<MenuListResponse[]>> => {
  return request.get({ url: '/api/menu/list/', data })
}

export const createMenuApi = (
  data: MenuCreateRequest | Record<string, any>
): Promise<IResponse<MenuBase>> => {
  return request.post({ url: '/api/menu/', data })
}

export const updateMenuApi = (
  data: MenuUpdateRequest | Record<string, any>
): Promise<IResponse<MenuBase>> => {
  return request.put({ url: '/api/menu/', data })
}

export const deleteMenuApi = (data: PrimaryKey): Promise<IResponse<MenuBase>> => {
  return request.delete({ url: '/api/menu/', data })
}
