export interface SaveUserOpts {
  hashPassword?: boolean
  requirePassword?: boolean
  currentUserId?: string
  skipPasswordValidation?: boolean
  skipPasswordRegexValidation?: boolean
  allowChangingEmail?: boolean
  isAccountHolder?: boolean
}
