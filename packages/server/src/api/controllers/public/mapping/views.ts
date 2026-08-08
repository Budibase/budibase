import { dataFilters } from "@budibase/shared-core"
import type { Ctx, RequiredKeys, ViewV2 } from "@budibase/types"
import type { View } from "./types"

export function view(body: ViewV2): RequiredKeys<View> {
  const sort =
    Array.isArray(body.sort) && body.sort.length <= 1 ? body.sort[0] : body.sort

  return {
    id: body.id,
    tableId: body.tableId,
    type: body.type,
    name: body.name,
    schema: body.schema!,
    primaryDisplay: body.primaryDisplay,
    query: dataFilters.buildQuery(body.query),
    sort,
  }
}

function mapView(ctx: Ctx<{ data: ViewV2 }>): { data: View } {
  return {
    data: view(ctx.body.data),
  }
}

function mapViews(ctx: Ctx<{ data: ViewV2[] }>): { data: View[] } {
  const views = ctx.body.data.map((body: ViewV2) => view(body))
  return { data: views }
}

export default {
  mapView,
  mapViews,
}
