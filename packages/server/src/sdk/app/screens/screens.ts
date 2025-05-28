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

  const response = await db.put({ ...screen, _id: generateScreenID() })
  return {
    ...screen,
    _id: response.id,
    _rev: response.rev,
  }
}

export async function update(screen: Screen) {
  const db = context.getAppDB()

  const response = await db.put(screen)
  return {
    ...screen,
    _rev: response.rev,
  }
}
