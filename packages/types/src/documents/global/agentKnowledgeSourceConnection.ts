import { AgentKnowledgeSourceType, Document } from "../../"

export interface AgentKnowledgeSourceConnection extends Document {
  sourceType: AgentKnowledgeSourceType
  connectionKey: string
  tenantId: string
  tokenEndpoint: string
  accessToken: string
  refreshToken: string
  tokenType?: string
  expiresAt?: number
  clientId: string
  clientSecret: string
}
