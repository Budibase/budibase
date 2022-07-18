export interface SaveAccountUser {
  accountId: string
  userId: string
  createdAt: number
}

export interface AccountUser extends SaveAccountUser {
  tenantId: string // for backwards compatibility with the accounts table. Really this is a USER#<id>
}

export interface CreateAccountUserActivity {
  accountId: string
  userId: string
  timestamp: number
}

export interface AccountUserActivity extends CreateAccountUserActivity {
  PK: string
  SK: string
}
