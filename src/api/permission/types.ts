type PermissionBase = {
  is_active: boolean
  permission_name: string
}

type PermissionListResponse = {
  id: number
  is_active: boolean
  description: string
  permission_name: string
}

type PermissionCreateRequest = {
  is_active: boolean
  permission_name: string
  description: string
}

type PermissionUpdateRequest = PermissionCreateRequest & {
  id: number
}
