import { layoutStore } from "./layouts.js"
import { appStore } from "./app.js"
import {
  componentStore,
  selectedComponent,
  selectedComponentPath,
} from "./components"
import { navigationStore } from "./navigation.js"
import { themeStore } from "./theme.js"
import { screenStore, selectedScreen, sortedScreens } from "./screens.js"
import { builderStore } from "./builder.js"
import { hoverStore } from "./hover.js"
import { previewStore } from "./preview.js"
import {
  automationStore,
  selectedAutomation,
  automationHistoryStore,
} from "./automations.js"
import { userStore, userSelectedResourceMap, isOnlyUser } from "./users.js"
import { deploymentStore } from "./deployments.js"

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
  hoverStore,
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
  await Promise.all([
    automationStore.actions.fetch(),
    datasources.init(),
    integrations.init(),
    queries.init(),
    tables.init(),
    roles.fetch(),
    flags.fetch(),
  ])
}

const resetBuilderHistory = () => {
  screenStore.history.reset()
  automationHistoryStore.reset()
}

export const initialise = async pkg => {
  const { application } = pkg
  // must be first operation to make sure subsequent requests have correct app ID
  appStore.syncAppPackage(pkg)
  await Promise.all([
    appStore.syncAppRoutes(),
    componentStore.refreshDefinitions(application?.appId),
  ])
  builderStore.init(application)
  navigationStore.syncAppNavigation(application?.navigation)
  themeStore.syncAppTheme(application)
  screenStore.syncAppScreens(pkg)
  layoutStore.syncAppLayouts(pkg)
  resetBuilderHistory()
  await refreshBuilderData()
}
