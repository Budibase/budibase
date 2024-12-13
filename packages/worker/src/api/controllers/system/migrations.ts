import {
  FetchMigrationDefinitionsResponse,
  RunGlobalMigrationRequest,
  RunGlobalMigrationResponse,
  UserCtx,
} from "@budibase/types"

const { migrate, MIGRATIONS } = require("../../../migrations")

export const runMigrations = async (
  ctx: UserCtx<RunGlobalMigrationRequest, RunGlobalMigrationResponse>
) => {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrate(options)
  ctx.body = { message: "Migration started." }
}

export const fetchDefinitions = async (
  ctx: UserCtx<void, FetchMigrationDefinitionsResponse>
) => {
  ctx.body = MIGRATIONS
}
