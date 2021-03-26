const fetch = require("node-fetch")
const vm = require("vm")

class ScriptExecutor {
  constructor(body) {
    this.script = new vm.Script(body.script)
    this.context = vm.createContext(body.context)
    this.context.fetch = fetch
  }

  execute() {
    this.script.runInContext(this.context)
    return this.context
  }
}

exports.execute = async function(ctx) {
  const executor = new ScriptExecutor(ctx.request.body)

  const result = executor.execute()

  ctx.body = result
}
