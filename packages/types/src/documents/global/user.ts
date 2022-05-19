export interface User {
  roles: UserRoles
}

export interface UserRoles {
  [key: string]: string
}
