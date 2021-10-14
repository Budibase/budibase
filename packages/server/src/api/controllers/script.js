const ScriptRunner = require("../../utilities/scriptRunner")

exports.execute = async function (ctx) {
  const { script, context } = ctx.request.body
  const runner = new ScriptRunner(script, context)
  ctx.body = runner.execute()
}

exports.save = async function (ctx) {
  ctx.throw(501, "Not currently implemented")
}
