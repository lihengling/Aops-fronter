type DepartmentBase = {
  id: number
  is_active: boolean
  department_name: string
}

type DepartmentListResponse = {
  id: number
  parent_id: number
  is_active: boolean
  description: string
  department_name: string
  children?: DepartmentListResponse[]
}

type DepartmentCreateRequest = {
  is_active: boolean
  parent_id: number
  department_name: string
  description: string
}

type DepartmentUpdateRequest = DepartmentCreateRequest & {
  id: number
}
