import { events } from "@budibase/backend-core"
import { Screen } from "@budibase/types"
import { getScreenParams } from "../../../../db/utils"

const getScreens = async (appDb: any): Promise<Screen[]> => {
  const response = await appDb.allDocs(
    getScreenParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any, timestamp: string | number) => {
  const screens = await getScreens(appDb)

  for (const screen of screens) {
    await events.screen.created(screen, timestamp)
  }

  return screens.length
}
