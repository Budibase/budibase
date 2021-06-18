const fetch = require("node-fetch")
const vm = require("vm")

class ScriptExecutor {
  constructor(body) {
    const code = `let fn = () => {\n${body.script}\n}; out = fn();`
    this.script = new vm.Script(code)
    this.context = vm.createContext(body.context)
    this.context.fetch = fetch
  }

  execute() {
    this.script.runInContext(this.context)
    return this.context.out
  }
}

exports.execute = async function (ctx) {
  const executor = new ScriptExecutor(ctx.request.body)

  ctx.body = executor.execute()
}

exports.save = async function (ctx) {
  ctx.throw(501, "Not currently implemented")
}
