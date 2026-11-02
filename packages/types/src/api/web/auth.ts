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

export interface ProjectTemplateIntent {
  templateKey: string
}

export interface SetInitInfoRequest {
  projectTemplate?: ProjectTemplateIntent
}
export interface SetInitInfoResponse {
  message: string
}

export interface GetInitInfoResponse extends SetInitInfoRequest {}

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
