export interface SaveUserOpts {
  hashPassword?: boolean
  requirePassword?: boolean
  allowSsoProviderUserId?: boolean
  currentUserId?: string
  skipPasswordValidation?: boolean
  skipPasswordRegexValidation?: boolean
  allowChangingEmail?: boolean
  isAccountHolder?: boolean
  assignDefaultGroup?: boolean
}
