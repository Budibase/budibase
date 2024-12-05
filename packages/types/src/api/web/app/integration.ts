import { Integration, SourceName } from "../../../sdk"

export type FetchIntegrationsResponse = Record<
  SourceName,
  Integration | undefined
>

export type FindIntegrationResponse = Integration
