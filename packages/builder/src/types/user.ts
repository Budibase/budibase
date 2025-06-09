import { BudibaseRoles } from "@/constants"

export interface UserInfo {
  email: string
  password: string
  forceResetPassword?: boolean
  role: keyof typeof BudibaseRoles
}
