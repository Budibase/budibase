export interface CreateAccountUserActivity {
  accountId: string
  userId: string
  timestamp: number
}

export interface AccountUserActivity extends CreateAccountUserActivity {
  PK: string
  SK: string
}
