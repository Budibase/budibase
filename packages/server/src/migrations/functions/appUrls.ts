import { db as dbCore } from "@budibase/backend-core"
import sdk from "../../sdk"

/**
 * Date:
 * January 2022
 *
 * Description:
 * Add the url to the app metadata if it doesn't exist
 */
export const run = async (appDb: any) => {
  let metadata
  try {
    metadata = await appDb.get(dbCore.DocumentType.APP_METADATA)
  } catch (e) {
    // sometimes the metadata document doesn't exist
    // exit early instead of failing the migration
    console.error("Error retrieving app metadata. Skipping", e)
    return
  }

  if (!metadata.url) {
    metadata.url = sdk.applications.getAppUrl({ name: metadata.name })
    console.log(`Adding url to app: ${metadata.url}`)
    await appDb.put(metadata)
  }
}
