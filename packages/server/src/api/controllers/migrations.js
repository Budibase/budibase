const { migrate } = require("../../migrations")

exports.migrate = async ctx => {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrate(options)
  ctx.status = 200
}
