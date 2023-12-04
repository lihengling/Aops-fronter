export type UserLoginType = {
  username: string
  password: string
}

export type UserType = {
  id: number
  username: string
  permission: string[]
  is_active: boolean
  is_admin: boolean
  token: string
}
