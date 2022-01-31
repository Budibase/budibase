const { DocumentTypes } = require("@budibase/backend-core/db")
import { getAppUrl } from "../../api/controllers/application"

/**
 * Date:
 * January 2022
 *
 * Description:
 * Add the url to the app metadata if it doesn't exist
 */
export const run = async (appDb: any) => {
  const metadata = await appDb.get(DocumentTypes.APP_METADATA)
  if (!metadata.url) {
    const context = {
      request: {
        body: {
          name: metadata.name,
        },
      },
    }
    metadata.url = getAppUrl(context)
    console.log(`Adding url to app: ${metadata.url}`)
  }
  await appDb.put(metadata)
}
