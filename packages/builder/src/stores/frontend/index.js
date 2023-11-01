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
import { builderStore, screensHeight } from "./builder.js"
import { previewStore } from "./preview.js"
import {
  automationStore,
  selectedAutomation,
  automationHistoryStore,
} from "./automations.js"
import { userStore, userSelectedResourceMap, isOnlyUser } from "./users.js"
import { deploymentStore } from "./deployments.js"
import { database } from "./database.js"

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
  screensHeight,
  deploymentStore,
  selectedComponent,
  selectedComponentPath,
}

export const reset = () => {
  appStore.reset()
  builderStore.reset()
  screenStore.reset()
  componentStore.reset()
  layoutStore.reset()
  navigationStore.reset()
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

  await automationStore.actions.fetch()

  screenStore.history.reset()

  automationHistoryStore.reset()
}
