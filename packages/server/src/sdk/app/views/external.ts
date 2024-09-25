import { ViewV2, ViewV2Enriched } from "@budibase/types"
import { context, HTTPError } from "@budibase/backend-core"

import sdk from "../../../sdk"
import * as utils from "../../../db/utils"
import { enrichSchema, isV2 } from "."
import { breakExternalTableId } from "../../../integrations/utils"

export async function get(viewId: string): Promise<ViewV2> {
  const { tableId } = utils.extractViewInfoFromID(viewId)

  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const ds = await sdk.datasources.get(datasourceId)

  const table = ds.entities![tableName]
  const views = Object.values(table.views!).filter(isV2)
  const found = views.find(v => v.id === viewId)
  if (!found) {
    throw new Error("No view found")
  }
  return found
}

export async function getEnriched(viewId: string): Promise<ViewV2Enriched> {
  const { tableId } = utils.extractViewInfoFromID(viewId)

  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const ds = await sdk.datasources.get(datasourceId)

  const table = ds.entities![tableName]
  const views = Object.values(table.views!).filter(isV2)
  const found = views.find(v => v.id === viewId)
  if (!found) {
    throw new Error("No view found")
  }
  return await enrichSchema(found, table.schema)
}

export async function create(
  tableId: string,
  viewRequest: Omit<ViewV2, "id" | "version">
): Promise<ViewV2> {
  const view: ViewV2 = {
    ...viewRequest,
    id: utils.generateViewID(tableId),
    version: 2,
  }

  const db = context.getAppDB()

  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const ds = await sdk.datasources.get(datasourceId)
  ds.entities![tableName].views ??= {}
  ds.entities![tableName].views![view.name] = view
  await db.put(ds)
  return view
}

export async function update(tableId: string, view: ViewV2): Promise<ViewV2> {
  const db = context.getAppDB()

  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const ds = await sdk.datasources.get(datasourceId)
  ds.entities![tableName].views ??= {}
  const views = ds.entities![tableName].views!

  const existingView = Object.values(views).find(
    v => isV2(v) && v.id === view.id
  )
  if (!existingView || !existingView.name) {
    throw new HTTPError(`View ${view.id} not found in table ${tableId}`, 404)
  }

  delete views[existingView.name]
  views[view.name] = view
  await db.put(ds)
  return view
}

export async function remove(viewId: string): Promise<ViewV2> {
  const db = context.getAppDB()

  const view = await get(viewId)

  if (!view) {
    throw new HTTPError(`View ${viewId} not found`, 404)
  }

  const { datasourceId, tableName } = breakExternalTableId(view.tableId)
  const ds = await sdk.datasources.get(datasourceId)

  delete ds.entities![tableName].views![view?.name]
  await db.put(ds)
  return view
}
