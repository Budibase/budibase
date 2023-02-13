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
