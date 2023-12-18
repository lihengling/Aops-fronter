type MenuBase = {
  id: number
  menu_name: string
  is_active: boolean
}

type MenuListResponse = {
  id: number
  parent_id: number
  children: MenuListResponse[]
  component: string
  frame_url: string
  icon: string
  is_active: boolean
  is_cache: boolean
  is_menu: boolean
  is_show: boolean
  menu_name: string
  menu_title: string
  path: string
  redirect: string
  sort: number
}

type MenuCreateRequest = {
  parent_id: number
  children: MenuListResponse[]
  component: string
  frame_url: string
  icon: string
  is_active: boolean
  is_cache: boolean
  is_menu: boolean
  is_show: boolean
  menu_name: string
  menu_title: string
  path: string
  redirect: string
  sort: number
}

type MenuUpdateRequest = MenuCreateRequest & {
  id: number
}
