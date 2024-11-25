import { Query, ExecuteQuery } from "./types"
import { RequiredKeys } from "@budibase/types"

function query(body: any): RequiredKeys<Query> {
  return {
    _id: body._id,
    datasourceId: body.datasourceId,
    parameters: body.parameters,
    fields: body.fields,
    queryVerb: body.queryVerb,
    name: body.name,
    schema: body.schema,
    transformer: body.transformer,
    readable: body.readable,
  }
}

function mapQueries(ctx: any): { data: Query[] } {
  const queries = ctx.body.map((body: any) => query(body))
  return {
    data: queries,
  }
}

function mapQueryExecution(ctx: any): ExecuteQuery {
  // very little we can map here, structure mostly unknown
  return {
    data: ctx.body.data,
    pagination: ctx.body.pagination,
    extra: {
      raw: ctx.body.raw,
      headers: ctx.body.headers,
    },
  }
}

export default {
  mapQueries,
  mapQueryExecution,
}
