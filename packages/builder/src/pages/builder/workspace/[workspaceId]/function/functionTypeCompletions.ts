import type {
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete"
import type {
  FunctionCompletionRequest,
  FunctionCompletionResponse,
} from "./functionTypeService"

// Unicode identifier characters, including JavaScript's permitted joiners.
const identifierCharacters = /[\p{ID_Continue}$\u200c\u200d]/u

export const createFunctionTypeCompletions = () => {
  const worker = new Worker(
    new URL("./functionTypes.worker.ts", import.meta.url),
    {
      type: "module",
    }
  )
  let requestId = 0
  const pending = new Map<
    number,
    (_response?: FunctionCompletionResponse) => void
  >()
  worker.onmessage = ({ data }: MessageEvent<FunctionCompletionResponse>) => {
    pending.get(data.id)?.(data)
  }
  worker.onerror = error => {
    console.error("Function completion worker failed", error.message)
    for (const finish of pending.values()) {
      finish()
    }
  }

  return {
    complete: ({
      context,
      declarations,
    }: {
      context: CompletionContext
      declarations: string
    }): Promise<CompletionResult | null> | null => {
      const member = context.matchBefore(
        new RegExp(`\\.${identifierCharacters.source}*$`, "u")
      )
      if (!member) {
        return null
      }
      const request: FunctionCompletionRequest = {
        id: ++requestId,
        source: context.state.doc.toString(),
        declarations,
        position: context.pos,
      }
      return new Promise(resolve => {
        const finish = (response?: FunctionCompletionResponse) => {
          clearTimeout(timeout)
          pending.delete(request.id)
          resolve(
            response?.completions.length && !context.aborted
              ? {
                  from: member.from + 1,
                  options: response.completions,
                  validFor: new RegExp(
                    `^${identifierCharacters.source}*$`,
                    "u"
                  ),
                }
              : null
          )
        }
        const timeout = setTimeout(() => finish(), 5000)
        pending.set(request.id, finish)
        context.addEventListener("abort", () => finish())
        worker.postMessage(request)
      })
    },
    destroy: () => {
      for (const finish of pending.values()) {
        finish()
      }
      worker.terminate()
    },
  }
}
