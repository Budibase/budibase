import env from "../environment"
import { IsolatedVM } from "../jsRunner/vm"

const JS_TIMEOUT_MS = 1000

class ScriptRunner {
  private code: string
  private vm: IsolatedVM

  constructor(script: string, context: any, { parseBson = false } = {}) {
    this.code = `(() => {${script}})();`
    this.vm = new IsolatedVM({
      memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
      timeout: JS_TIMEOUT_MS,
    }).withContext(context)

    if (parseBson && context.data) {
      this.vm = this.vm.withParsingBson(context.data)
    }
  }

  execute() {
    const result = this.vm.execute(this.code)
    return result
  }
}

export default ScriptRunner
