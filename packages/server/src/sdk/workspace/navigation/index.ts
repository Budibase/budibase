import { HTTPError } from "@budibase/backend-core"
import { MAX_NAV_DEPTH } from "@budibase/shared-core"
import sdk from "../.."
import { AppNavigation, AppNavigationLink } from "@budibase/types"

export async function addLink({
  label,
  url,
  roleId,
  workspaceAppId,
}: {
  label: string
  url: string
  roleId: string
  workspaceAppId: string
}) {
  const workspaceApp = await sdk.workspaceApps.get(workspaceAppId)
  if (!workspaceApp) {
    throw new HTTPError("Workspace app should be defined", 500)
  }
  workspaceApp.navigation.links ??= []
  workspaceApp.navigation.links.push({
    text: label,
    url,
    roleId,
    type: "link",
  })

  await sdk.workspaceApps.update(workspaceApp)
}

// Removes links pointing at the route, at every depth. A group whose header
// links to the route keeps its children and only loses the URL, so deleting
// one screen never silently deletes a whole subtree.
function pruneLinks(
  links: AppNavigationLink[],
  route: string
): AppNavigationLink[] {
  return links
    .filter(link => link.type === "sublinks" || link.url !== route)
    .map(link =>
      link.type === "sublinks"
        ? {
            ...link,
            url: link.url === route ? "" : link.url,
            subLinks: pruneLinks(link.subLinks || [], route),
          }
        : link
    )
}

export async function deleteLink(route: string, workspaceAppId: string) {
  const workspaceApp = (await sdk.workspaceApps.get(workspaceAppId!))!
  workspaceApp.navigation.links ??= []

  const updatedLinks = pruneLinks(workspaceApp.navigation.links, route)

  await sdk.workspaceApps.update({
    ...workspaceApp,
    navigation: { ...workspaceApp.navigation, links: updatedLinks },
  })
}

// The client renderer stops at MAX_NAV_DEPTH, so reject deeper trees here
// rather than silently dropping them at render time.
function validateDepth(links: AppNavigationLink[], depth = 1) {
  for (const link of links || []) {
    if (depth > MAX_NAV_DEPTH) {
      throw new HTTPError(
        `Navigation supports up to ${MAX_NAV_DEPTH} levels of links`,
        400
      )
    }
    if (link.subLinks?.length) {
      validateDepth(link.subLinks, depth + 1)
    }
  }
}

export async function update(
  workspaceAppId: string,
  navigation: AppNavigation
) {
  const workspaceApp = await sdk.workspaceApps.get(workspaceAppId)
  if (!workspaceApp) {
    throw new HTTPError("Workspace app not found", 400)
  }
  validateDepth(navigation?.links || [])
  await sdk.workspaceApps.update({ ...workspaceApp, navigation })
}
