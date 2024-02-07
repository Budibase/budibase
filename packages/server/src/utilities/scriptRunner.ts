import env from "../environment"
import { IsolatedVM } from "../jsRunner/vm"

const JS_TIMEOUT_MS = 1000
class ScriptRunner {
  #code

  constructor(script: string, context: any) {
    this.#code = `let fn = () => {\n${script}\n}; results.out = fn();`
  }

  execute() {
    const vm = new IsolatedVM({
      memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
      timeout: JS_TIMEOUT_MS,
    }).withHelpers()
    const result = vm.execute(this.#code)
    return result
  }
}

export default ScriptRunner
