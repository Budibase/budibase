import { ResponseFormat } from "@budibase/types"
import openai from "openai"

export interface MockLLMResponseOpts {
  baseUrl?: string
  format?: ResponseFormat
  times?: number
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => void

export function parseResponseFormat(
  responseFormat?: ResponseFormat
):
  | openai.ResponseFormatText
  | openai.ResponseFormatJSONObject
  | openai.ResponseFormatJSONSchema
  | undefined {
  if (!responseFormat) {
    return
  }

  if (responseFormat === "text") {
    return { type: "text" }
  }
  if (responseFormat === "json") {
    return { type: "json_object" }
  }

  return responseFormat
}
