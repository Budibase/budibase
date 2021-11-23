const fetch = require("node-fetch")
const { VM, VMScript } = require("vm2")
const JS_TIMEOUT_MS = 1000

class ScriptRunner {
  constructor(script, context) {
    const code = `let fn = () => {\n${script}\n}; results.out = fn();`
    this.vm = new VM({
      timeout: JS_TIMEOUT_MS,
    })
    this.results = { out: "" }
    this.vm.setGlobals(context)
    this.vm.setGlobal("fetch", fetch)
    this.vm.setGlobal("results", this.results)
    this.script = new VMScript(code)
  }

  execute() {
    this.vm.run(this.script)
    return this.results.out
  }
}

module.exports = ScriptRunner
