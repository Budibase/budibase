export interface DatasourceAuthCookie {
  appId: string
  provider: string
  returnPath?: string
}

export interface SessionCookie {
  sessionId: string
  userId: string
}

export interface FeatureFlagCookie {
  flags: Record<string, boolean>
}
