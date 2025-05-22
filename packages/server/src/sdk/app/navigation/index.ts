import { context } from "@budibase/backend-core"
import sdk from "../.."

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
  })

  const db = context.getAppDB()
  await db.put(appMetadata)
}
