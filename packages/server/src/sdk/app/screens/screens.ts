import { context } from "@budibase/backend-core"
import { Database, Screen, WithoutDocMetadata } from "@budibase/types"
import { generateScreenID, getScreenParams } from "../../../db/utils"

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

export async function create(screen: WithoutDocMetadata<Screen>) {
  const db = context.getAppDB()

  await db.put({ ...screen, _id: generateScreenID() })
}
