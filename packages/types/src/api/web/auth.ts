export interface LoginRequest {
  username: string
  password: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetUpdateRequest {
  resetCode: string
  password: string
}

export interface UpdateSelfRequest {
  firstName?: string
  lastName?: string
  password?: string
  forceResetPassword?: boolean
  onboardedAt?: string
}

export interface UpdateSelfResponse {
  _id: string
  _rev: string
}
