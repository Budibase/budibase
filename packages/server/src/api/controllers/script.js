const fetch = require("node-fetch")
const vm = require("vm")

class ScriptExecutor {
  constructor(body) {
    this.script = new vm.Script(body.script)
    this.context = vm.createContext(body.context)
    this.context.fetch = fetch
  }

  execute() {
    return this.script.runInContext(this.context)
  }
}

exports.execute = async function (ctx) {
  const executor = new ScriptExecutor(ctx.request.body)

  ctx.body = executor.execute()
}

exports.save = async function (ctx) {
  ctx.throw(501, "Not currently implemented")
}
