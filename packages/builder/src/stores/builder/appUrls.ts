import { derived } from "svelte/store"
import { appStore, selectedScreen, workspaceAppStore } from "."
import { featureFlags } from "../portal"

function buildUrl({ paths, route }: { paths: string[]; route: string }) {
  const { host, protocol } = window.location

  const trimSlashes = (value: string) =>
    value.replace(/^\/*/, "").replace(/^\/$/, "")
  const parsedPaths = paths
    .map(trimSlashes)
    .filter(x => x)
    .join("/")
  let url = `${protocol}//${host}/${parsedPaths}`

  route = trimSlashes(route)
  if (route) {
    url += `/#/${route}`
  }
  return url
}

export const selectedAppUrls = derived(
  [workspaceAppStore, selectedScreen, featureFlags, appStore],
  ([$workspaceAppStore, $selectedScreen, $featureFlags, $appStore]) => {
    const selectedWorkspaceApp = $workspaceAppStore.selectedWorkspaceApp

    const route = $selectedScreen?.routing.route || ""
    const workspacePrefix =
      $featureFlags.WORKSPACE_APPS && selectedWorkspaceApp
        ? selectedWorkspaceApp.url
        : ""

    const previewUrl = buildUrl({
      paths: [$appStore.appId, workspacePrefix],
      route,
    })

    const liveUrl = buildUrl({
      paths: [`/app${$appStore.url}`, workspacePrefix],
      route: "", // Ignore the route for live urls
    })
    return { previewUrl, liveUrl }
  }
)
