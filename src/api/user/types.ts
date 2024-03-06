type UserBase = {
  is_active: boolean
  username: string
}

type UserListResponse = {
  id: number
  is_admin: boolean
  is_active: boolean
  username: string
  department: string
}

type UserCreateRequest = {
  username: string
  password: string
  role_id: Array<number>
  department_id: number
}

type UserUpdateRequest = {
  username: string
  is_active: boolean
  role_id: Array<number>
  menu_id: Array<number>
  department_id: number
}

type UserMeunResponse = {
  is_active: boolean
  username: string
  menu: Array<object>
}
