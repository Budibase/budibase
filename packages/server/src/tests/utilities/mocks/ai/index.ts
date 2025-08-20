import { ResponseFormat } from "@budibase/types"

export interface MockLLMResponseOpts {
  baseUrl?: string
  format?: ResponseFormat
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => void
