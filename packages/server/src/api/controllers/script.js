const CouchDB = require("../../db")
const vm = require("vm")

class ScriptExecutor {
  constructor(script) {
    this.script = script
  }

  execute() {
    vm.runInNewContext(this.script, {
      require: require,
      console: console,
    })
  }
}

exports.execute = async function(ctx) {
  const appId = ctx.user.appId

  const executor = new ScriptExecutor(ctx.request.body.script)

  const result = executor.execute()

  ctx.body = result
}
