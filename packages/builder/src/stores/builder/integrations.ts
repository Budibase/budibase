import { writable, type Writable } from "svelte/store"
import { API } from "api"
import { Integration, SourceName } from "@budibase/types"

type IntegrationsState = Record<SourceName, Integration | undefined>

const INITIAL_STATE: IntegrationsState = {
  [SourceName.POSTGRES]: undefined,
  [SourceName.DYNAMODB]: undefined,
  [SourceName.MONGODB]: undefined,
  [SourceName.ELASTICSEARCH]: undefined,
  [SourceName.COUCHDB]: undefined,
  [SourceName.SQL_SERVER]: undefined,
  [SourceName.S3]: undefined,
  [SourceName.AIRTABLE]: undefined,
  [SourceName.MYSQL]: undefined,
  [SourceName.ARANGODB]: undefined,
  [SourceName.REST]: undefined,
  [SourceName.FIRESTORE]: undefined,
  [SourceName.GOOGLE_SHEETS]: undefined,
  [SourceName.REDIS]: undefined,
  [SourceName.SNOWFLAKE]: undefined,
  [SourceName.ORACLE]: undefined,
  [SourceName.BUDIBASE]: undefined,
}

const createIntegrationsStore = () => {
  const store: Writable<IntegrationsState> = writable(INITIAL_STATE)

  const init = async () => {
    const integrations = await API.getIntegrations()
    store.set(integrations)
  }

  return {
    ...store,
    init,
  }
}

export const integrations = createIntegrationsStore()
