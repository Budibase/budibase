import { layoutStore } from "./layouts.js"
import { appStore } from "./app.js"
import {
  componentStore,
  selectedComponent,
  selectedComponentPath,
} from "./components"
import { navigationStore } from "./navigation.js"
import { themeStore } from "./theme.js"
import {
  screenStore,
  selectedScreen,
  currentAsset,
  sortedScreens,
} from "./screens.js"
import { builderStore } from "./builder.js"
import { previewStore } from "./preview.js"
import {
  automationStore,
  selectedAutomation,
  automationHistoryStore,
} from "./automations.js"
import { userStore, userSelectedResourceMap, isOnlyUser } from "./users.js"
import { deploymentStore } from "./deployments.js"
import { database } from "./database.js"

// Backend
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
  layoutStore,
  database,
  appStore,
  componentStore,
  navigationStore,
  themeStore,
  screenStore,
  selectedScreen,
  builderStore,
  userSelectedResourceMap,
  previewStore,
  automationStore,
  selectedAutomation,
  automationHistoryStore,
  currentAsset,
  sortedScreens,
  userStore,
  isOnlyUser,
  deploymentStore,
  selectedComponent,
  selectedComponentPath,
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

export const reset = () => {
  appStore.reset()
  builderStore.reset()
  screenStore.reset()
  componentStore.reset()
  layoutStore.reset()
  navigationStore.reset()
}

const refreshBuilderData = async () => {
  await automationStore.actions.fetch()
  await datasources.init()
  await integrations.init()
  await queries.init()
  await tables.init()
  await roles.fetch()
  await flags.fetch()
}

const resetBuilderHistory = () => {
  screenStore.history.reset()
  automationHistoryStore.reset()
}

export const initialise = async pkg => {
  const { application } = pkg

  appStore.syncAppPackage(pkg)

  appStore.syncAppRoutes()

  builderStore.init(application)

  navigationStore.syncAppNavigation(application?.navigation)

  await componentStore.refreshDefinitions(application?.appId)

  themeStore.syncAppTheme(application)

  screenStore.syncAppScreens(pkg)

  layoutStore.syncAppLayouts(pkg)

  // required for api comms
  database.syncAppDatabase(pkg)

  resetBuilderHistory()

  await refreshBuilderData()
}
