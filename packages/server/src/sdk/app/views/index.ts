import { context } from "@budibase/backend-core"
import { ViewV2 } from "@budibase/types"
import * as utils from "../../../db/utils"

export async function get(viewId: string): Promise<ViewV2 | undefined> {
  const db = context.getAppDB()
  try {
    const result = await db.get<ViewV2>(viewId)
    return result
  } catch (err: any) {
    if (err.status === 404) {
      return undefined
    }

    throw err
  }
}

export async function create(view: ViewV2): Promise<ViewV2> {
  const db = context.getAppDB()

  const response = await db.put(
    {
      _id: utils.generateViewID(view.tableId),
      ...view,
    },
    {}
  )
  return {
    ...view,
    _id: response.id,
    _rev: response.rev,
  }
}

export async function remove(viewId: string, rev: string): Promise<void> {
  const db = context.getAppDB()
  await db.remove(viewId, rev)
}
