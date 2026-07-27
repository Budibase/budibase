export interface DatasourceAuthCookie {
  appId: string
  provider: string
  returnPath?: string
  connectionId?: string
}

export interface SessionCookie {
  sessionId: string
  userId: string
  exp?: number
}

export interface FeatureFlagCookie {
  flags: Record<string, boolean>
}
