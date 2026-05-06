export interface DatasourceAuthCookie {
  appId: string
  provider: string
  returnPath?: string
  connectionId?: string
  datasourceId?: string
  authConfigId?: string
}

export interface SessionCookie {
  sessionId: string
  userId: string
}

export interface FeatureFlagCookie {
  flags: Record<string, boolean>
}
