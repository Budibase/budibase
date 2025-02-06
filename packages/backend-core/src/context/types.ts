import { IdentityContext, Snippet, Table, VM } from "@budibase/types"
import { OAuth2Client } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

// keep this out of Budibase types, don't want to expose context info
export type ContextMap = {
  tenantId?: string
  appId?: string
  identity?: IdentityContext
  environmentVariables?: Record<string, string>
  isScim?: boolean
  ip?: string
  automationId?: string
  isMigrating?: boolean
  vm?: VM
  cleanup?: (() => void | Promise<void>)[]
  snippets?: Snippet[]
  googleSheets?: {
    oauthClient: OAuth2Client
    clients: Record<string, GoogleSpreadsheet>
  }
  featureFlagCache?: {
    [key: string]: Record<string, boolean>
  }
  viewToTableCache?: Record<string, Table>
}
