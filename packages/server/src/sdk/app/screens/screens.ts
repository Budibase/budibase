import { getScreenParams } from "../../../db/utils"
import { context } from "@budibase/backend-core"
import { Screen } from "@budibase/types"

export async function fetch(db = context.getAppDB()): Promise<Screen[]> {
  return (
    await db.allDocs<Screen>(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(el => el.doc!)
}
