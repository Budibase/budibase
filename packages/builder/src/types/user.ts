import { Constants } from "@budibase/frontend-core"

export interface UserInfo {
  email: string
  password: string
  forceResetPassword?: boolean
  role: keyof typeof Constants.BudibaseRoles
}
