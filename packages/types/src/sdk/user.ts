export interface UpdateSelf {
  firstName?: string
  lastName?: string
  password?: string
  forceResetPassword?: boolean
}

export interface SaveUserOpts {
  hashPassword?: boolean
  requirePassword?: boolean
  currentUserId?: string
}
