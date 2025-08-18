import { layoutStore } from "./layouts"
import { workspaceAppStore } from "./workspaceApps"
import { workspaceFavouriteStore } from "./workspaceFavourites"
import { appStore } from "./app"
import { componentStore, selectedComponent } from "./components"
import { navigationStore } from "./navigation"
import { themeStore } from "./theme"
import { screenStore, selectedScreen, sortedScreens } from "./screens"
import { builderStore } from "./builder"
import { hoverStore } from "./hover"
import { previewStore } from "./preview"
import { workspaceDeploymentStore } from "./workspaceDeployment"
import {
  automationStore,
  selectedAutomation,
  automationHistoryStore,
  evaluationContext,
} from "./automations"
import { userStore, userSelectedResourceMap, isOnlyUser } from "./users"
import { deploymentStore } from "./deployment"
import { contextMenuStore } from "./contextMenu"
import { snippets } from "./snippets"
import {
  screenComponentsList,
  screenComponentErrors,
  screenComponentErrorList,
} from "./screenComponent"

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
import { rowActions } from "./rowActions"
import componentTreeNodesStore from "./componentTreeNodes"
import { oauth2 } from "./oauth2"
import { recaptchaStore } from "./recaptcha"
import { dataEnvironmentStore, dataAPI } from "./dataEnvironment"

import { FetchAppPackageResponse } from "@budibase/types"
import { selectedAppUrls } from "./appUrls"

export {
  componentTreeNodesStore,
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
  contextMenuStore,
  selectedComponent,
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
  snippets,
  rowActions,
  evaluationContext,
  screenComponentsList,
  screenComponentErrors,
  screenComponentErrorList,
  oauth2,
  workspaceAppStore,
  selectedAppUrls,
  workspaceDeploymentStore,
  workspaceFavouriteStore,
  recaptchaStore,
  dataEnvironmentStore,
  dataAPI,
}

export const reset = () => {
  appStore.reset()
  builderStore.reset()
  screenStore.reset()
  componentStore.reset()
  layoutStore.reset()
  navigationStore.reset()
  rowActions.reset()
  workspaceDeploymentStore.reset()
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
    workspaceAppStore.fetch(),
    workspaceDeploymentStore.fetch(),
  ])
}

const resetBuilderHistory = () => {
  screenStore.history.reset()
  automationHistoryStore.reset()
}

export const initialise = async (pkg: FetchAppPackageResponse) => {
  const { application, recaptchaKey } = pkg
  // must be first operation to make sure subsequent requests have correct app ID
  appStore.syncAppPackage(pkg)
  await Promise.all([
    appStore.syncAppRoutes(),
    componentStore.refreshDefinitions(application?.appId),
  ])
  builderStore.init(application)
  navigationStore.syncAppNavigation(application?.navigation)
  themeStore.syncAppTheme(application)
  recaptchaStore.syncRecaptcha(application, recaptchaKey)
  snippets.syncMetadata(application)
  screenStore.syncAppScreens(pkg)
  layoutStore.syncAppLayouts(pkg)
  workspaceFavouriteStore.sync()
  resetBuilderHistory()
  await refreshBuilderData()
}
