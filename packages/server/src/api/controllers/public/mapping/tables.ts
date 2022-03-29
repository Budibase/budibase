import { Table } from "./types"

function table(body: any): Table {
  return {
    _id: body._id,
    name: body.name,
    schema: body.schema,
    primaryDisplay: body.primaryDisplay,
  }
}

function mapTable(ctx: any): { data: Table } {
  return {
    data: table(ctx.body),
  }
}

function mapTables(ctx: any): { data: Table[] } {
  const tables = ctx.body.map((body: any) => table(body))
  return { data: tables }
}

export default {
  mapTable,
  mapTables,
}
