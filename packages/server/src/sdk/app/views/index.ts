import { HTTPError, context } from "@budibase/backend-core"
import { View, ViewV2 } from "@budibase/types"

import sdk from "../../../sdk"
import { utils as coreUtils } from "@budibase/backend-core"

export async function get(
  tableId: string,
  viewId: string
): Promise<ViewV2 | undefined> {
  const table = await sdk.tables.getTable(tableId)
  const views = Object.values(table.views!)
  const view = views.find(v => isV2(v) && v.id === viewId) as ViewV2 | undefined

  return view
}

export async function create(
  tableId: string,
  viewRequest: Omit<ViewV2, "id" | "version">
): Promise<ViewV2> {
  const view: ViewV2 = {
    ...viewRequest,
    id: coreUtils.newid(),
    version: 2,
  }

  const db = context.getAppDB()
  const table = await sdk.tables.getTable(tableId)
  table.views ??= {}

  table.views[view.name] = view
  await db.put(table)
  return view
}

export function isV2(view: View | ViewV2): view is ViewV2 {
  return (view as ViewV2).version === 2
}

export async function remove(tableId: string, viewId: string): Promise<void> {
  const db = context.getAppDB()

  const table = await sdk.tables.getTable(tableId)
  const view = await get(tableId, viewId)
  if (!view) {
    throw new HTTPError(`View ${viewId} not found in table ${tableId}`, 404)
  }

  delete table.views![view?.name]
  await db.put(table)
}
