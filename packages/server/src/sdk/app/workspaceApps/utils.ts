import { AppNavigationLink } from "@budibase/types"
import { get, update } from "./crud"

export async function addLink(workspaceAppId: string, link: AppNavigationLink) {
  const workspaceApp = await get(workspaceAppId)
  if (!workspaceApp) {
    throw new Error("Workspace App not found")
  }
  workspaceApp.navigation.links ??= []
  workspaceApp.navigation.links.push(link)
  await update(workspaceApp)
}
