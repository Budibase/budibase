import { context } from "@budibase/backend-core"
import sdk from "../.."
import { App, AppNavigation } from "@budibase/types"

export async function addLink({
  label,
  url,
  roleId,
}: {
  label: string
  url: string
  roleId: string
}) {
  const appMetadata = await sdk.applications.metadata.get()
  appMetadata.navigation ??= {
    navigation: "Top",
  }
  appMetadata.navigation.links ??= []
  appMetadata.navigation.links.push({
    text: label,
    url,
    roleId,
    type: "link",
  })

  const db = context.getAppDB()
  await db.put(appMetadata)
}

export async function deleteLink(route: string) {
  const appMetadata = await sdk.applications.metadata.get()
  const navigation = appMetadata.navigation
  if (!navigation || !navigation.links?.length) {
    return
  }

  // Filter out top level links pointing to these URLs
  const updatedLinks = navigation.links.filter(link => link.url !== route)

  // Filter out nested links pointing to these URLs
  updatedLinks.forEach(link => {
    if (link.type === "sublinks" && link.subLinks?.length) {
      link.subLinks = link.subLinks.filter(subLink => subLink.url !== route)
    }
  })

  const db = context.getAppDB()
  const updatedMetadata: App = {
    ...appMetadata,
    navigation: {
      ...navigation,
      links: updatedLinks,
    },
  }
  await db.put(updatedMetadata)
}

export async function update(navigation: AppNavigation) {
  const appMetadata = await sdk.applications.metadata.get()
  appMetadata.navigation = navigation

  const db = context.getAppDB()
  await db.put(appMetadata)
}
