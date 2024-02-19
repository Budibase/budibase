import vm from "vm"
import env from "../environment"
import { setJSRunner, setOnErrorLog } from "@budibase/string-templates"
import { logging } from "@budibase/backend-core"
import tracer from "dd-trace"
import { serializeError } from "serialize-error"
import { BuiltInVM } from "./vm"

export function init() {
  setJSRunner((js: string, ctx: vm.Context) => {
    return tracer.trace("runJS", {}, span => {
      const vm = new BuiltInVM(ctx, span)
      return vm.execute(js)
    })
  })

  if (env.LOG_JS_ERRORS) {
    setOnErrorLog((error: Error) => {
      logging.logWarn(
        `Error while executing js: ${JSON.stringify(serializeError(error))}`
      )
    })
  }
}
