import type { ScreenLayoutType } from "../../documents/global/user"

export interface LoginRequest {
  username: string
  password: string
}
export interface LoginResponse {
  message: string
  userId?: string
}

export interface LogoutResponse {
  message: string
}

export interface SetInitInfoRequest extends Record<string, any> {}
export interface SetInitInfoResponse {
  message: string
}

export interface GetInitInfoResponse extends Record<string, any> {}

export interface PasswordResetRequest {
  email: string
}
export interface PasswordResetResponse {
  message: string
}

export interface PasswordResetUpdateRequest {
  resetCode: string
  password: string
}
export interface PasswordResetUpdateResponse {
  message: string
}

export interface UpdateSelfRequest {
  firstName?: string
  lastName?: string
  password?: string
  forceResetPassword?: boolean
  freeTrialConfirmedAt?: string
  appFavourites?: string[]
  appSort?: string
  defaultLayout?: ScreenLayoutType
}

export interface UpdateSelfResponse {
  _id: string
  _rev: string
}
