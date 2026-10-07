import type { Completion } from "@codemirror/autocomplete"
import {
  createFunctionTypeService,
  type FunctionCompletionRequest,
  type FunctionCompletionResponse,
} from "./functionTypeService"

const service = createFunctionTypeService()

self.onmessage = ({ data }: MessageEvent<FunctionCompletionRequest>) => {
  let completions: Completion[] = []
  try {
    completions = service.complete(data)
  } catch (error) {
    console.error("Unable to complete Function source", error)
  }
  const response: FunctionCompletionResponse = { id: data.id, completions }
  self.postMessage(response)
}
