import tracer, { Span } from "dd-trace"
import env from "../environment"
import { IsolatedVM } from "../jsRunner/vm"

const JS_TIMEOUT_MS = 1000

class ScriptRunner {
  private code: string
  private vm: IsolatedVM

  private tracerSpan: Span

  constructor(script: string, context: any, { parseBson = false } = {}) {
    this.tracerSpan = tracer.startSpan("scriptRunner", { tags: { parseBson } })

    this.code = `(() => {${script}})();`
    this.vm = new IsolatedVM({
      memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
      invocationTimeout: JS_TIMEOUT_MS,
    }).withContext(context)

    if (parseBson && context.data) {
      this.vm = this.vm.withParsingBson(context.data)
    }
  }

  execute() {
    const result = tracer.trace(
      "scriptRunner.execute",
      { childOf: this.tracerSpan },
      () => {
        const result = this.vm.execute(this.code)
        return result
      }
    )
    this.tracerSpan.finish()
    return result
  }
}

export default ScriptRunner
