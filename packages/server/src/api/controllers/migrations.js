const { migrate, MIGRATIONS } = require("../../migrations")

exports.migrate = async ctx => {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrate(options)
  ctx.status = 200
}

exports.fetchDefinitions = async ctx => {
  ctx.body = MIGRATIONS
  ctx.status = 200
}
