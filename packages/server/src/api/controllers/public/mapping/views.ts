import { View } from "./types"
import { ViewV2, Ctx, RequiredKeys } from "@budibase/types"
import { dataFilters } from "@budibase/shared-core"

function view(body: ViewV2): RequiredKeys<View> {
  return {
    id: body.id,
    tableId: body.tableId,
    type: body.type,
    name: body.name,
    schema: body.schema!,
    primaryDisplay: body.primaryDisplay,
    query: dataFilters.buildQuery(body.query),
    sort: body.sort,
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
