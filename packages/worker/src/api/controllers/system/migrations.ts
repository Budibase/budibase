const { migrate, MIGRATIONS } = require("../../../migrations")

export const runMigrations = async (ctx: any) => {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrate(options)
  ctx.status = 200
}

export const fetchDefinitions = async (ctx: any) => {
  ctx.body = MIGRATIONS
  ctx.status = 200
}
