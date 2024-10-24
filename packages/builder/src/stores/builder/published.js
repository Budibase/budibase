import { appStore } from "./app"
import { appsStore } from "stores/portal/apps"
import { deploymentStore } from "./deployments"
import { derived } from "svelte/store"

export const appPublished = derived(
  [appStore, appsStore, deploymentStore],
  ([$appStore, $appsStore, $deploymentStore]) => {
    const app = $appsStore.apps.find(app => app.devId === $appStore.appId)
    const deployments = $deploymentStore.filter(x => x.status === "SUCCESS")
    return app?.status === "published" && deployments.length > 0
  }
)
