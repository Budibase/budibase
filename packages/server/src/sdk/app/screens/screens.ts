import { context } from "@budibase/backend-core"
import { Database, Screen } from "@budibase/types"
import { getScreenParams } from "../../../db/utils"

export async function fetch(
  db: Database = context.getAppDB()
): Promise<Screen[]> {
  const screens = (
    await db.allDocs<Screen>(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(el => el.doc!)

  return screens
}
