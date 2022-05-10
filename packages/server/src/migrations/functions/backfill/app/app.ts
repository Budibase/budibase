import { events, db } from "@budibase/backend-core"
import { App } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const app: App = await appDb.get(db.DocumentTypes.APP_METADATA)

  if (db.isDevAppID(app.appId)) {
    events.app.created(app)
  }

  if (db.isProdAppID(app.appId)) {
    events.app.published(app)
  }
}
