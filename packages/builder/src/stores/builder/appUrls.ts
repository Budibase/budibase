import { derived } from "svelte/store"
import { appStore, selectedScreen, workspaceAppStore } from "."
import { featureFlags } from "../portal"
import { buildLiveUrl, buildPreviewUrl } from "@/helpers/urls"

export const selectedAppUrls = derived(
  [workspaceAppStore, selectedScreen, featureFlags, appStore],
  ([$workspaceAppStore, $selectedScreen, $featureFlags, $appStore]) => {
    const selectedWorkspaceApp = $workspaceAppStore.selectedWorkspaceApp

    const route = $selectedScreen?.routing.route || ""
    const workspacePrefix =
      $featureFlags.WORKSPACES && selectedWorkspaceApp
        ? selectedWorkspaceApp.url
        : ""

    const previewUrl = buildPreviewUrl($appStore, workspacePrefix, route, true)

    const liveUrl = buildLiveUrl($appStore, workspacePrefix, true)
    return { previewUrl, liveUrl }
  }
)
