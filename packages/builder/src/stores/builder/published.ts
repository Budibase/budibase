import { appStore } from "./app"
import { appsStore } from "@/stores/portal/apps"
import { deploymentStore } from "./deployments"
import { derived, type Readable } from "svelte/store"
import { DeploymentProgressResponse, DeploymentStatus } from "@budibase/types"

export const appPublished: Readable<boolean> = derived(
  [appStore, appsStore, deploymentStore],
  ([$appStore, $appsStore, $deploymentStore]) => {
    const app = $appsStore.apps.find(app => app.devId === $appStore.appId)
    const deployments = $deploymentStore.filter(
      (x: DeploymentProgressResponse) => x.status === DeploymentStatus.SUCCESS
    )
    return app?.status === "published" && deployments.length > 0
  }
)
