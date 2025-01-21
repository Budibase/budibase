export interface SaveUserOpts {
  hashPassword?: boolean
  requirePassword?: boolean
  currentUserId?: string
  skipPasswordValidation?: boolean
  allowChangingEmail?: boolean
}
