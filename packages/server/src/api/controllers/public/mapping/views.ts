import { View } from "./types"

function view(body: any): View {
  return {
    id: body.id,
    name: body.name,
    schema: body.schema,
    primaryDisplay: body.primaryDisplay,
  }
}

function mapView(ctx: any): { data: View } {
  return {
    data: view(ctx.body),
  }
}

function mapViews(ctx: any): { data: View[] } {
  const tables = ctx.body.map((body: any) => view(body))
  return { data: tables }
}

export default {
  mapView,
  mapViews,
}
