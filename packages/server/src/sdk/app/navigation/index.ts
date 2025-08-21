import { HTTPError } from "@budibase/backend-core"
import sdk from "../.."
import { AppNavigation } from "@budibase/types"

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

export async function deleteLink(route: string, workspaceAppId: string) {
  const workspaceApp = (await sdk.workspaceApps.get(workspaceAppId!))!
  workspaceApp.navigation.links ??= []

  // Filter out top level links pointing to these URLs
  const updatedLinks = workspaceApp.navigation.links.filter(
    link => link.url !== route
  )

  // Filter out nested links pointing to these URLs
  updatedLinks.forEach(link => {
    if (link.type === "sublinks" && link.subLinks?.length) {
      link.subLinks = link.subLinks.filter(subLink => subLink.url !== route)
    }
  })

  await sdk.workspaceApps.update({
    ...workspaceApp,
    navigation: { ...workspaceApp.navigation, links: updatedLinks },
  })
}

export async function update(
  workspaceAppId: string,
  navigation: AppNavigation
) {
  const workspaceApp = await sdk.workspaceApps.get(workspaceAppId)
  if (!workspaceApp) {
    throw new HTTPError("Workspace app not found", 400)
  }
  await sdk.workspaceApps.update({ ...workspaceApp, navigation })
}
