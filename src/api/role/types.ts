type RoleBase = {
  id: number
  is_active: boolean
  name: string
  role_name: string
}

type RoleListResponse = {
  id: number
  name: string
  is_active: boolean
  is_admin: boolean
  description: string
  role_name: string
  permissions: Array<any>
}

type RoleCreateRequest = {
  name: string
  is_active: boolean
  role_name: string
  description: string
  permission_id: Array<number>
}

type RoleUpdateRequest = RoleCreateRequest & {
  id: number
}
