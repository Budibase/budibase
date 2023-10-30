import { tables } from "./tables"
import { views } from "./views"
import { viewsV2 } from "./viewsV2"
import { permissions } from "./permissions"
import { roles } from "./roles"
import { datasources } from "./datasources"
import { integrations } from "./integrations"
import { sortedIntegrations } from "./sortedIntegrations"
import { queries } from "./queries"
import { flags } from "./flags"

export {
  tables,
  views,
  viewsV2,
  permissions,
  roles,
  datasources,
  integrations,
  sortedIntegrations,
  queries,
  flags,
}

export const initialise = async () => {
  await datasources.init()
  await integrations.init()
  await queries.init()
  await tables.init()
  await roles.fetch()
  await flags.fetch()
}
