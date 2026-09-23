import { ResponseFormat } from "@budibase/types"

export interface MockLLMResponseOpts {
  baseUrl?: string
  format?: ResponseFormat
  onRequest?: (body: object) => void
  times?: number
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => void
