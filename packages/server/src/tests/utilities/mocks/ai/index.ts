import { ResponseFormat } from "@budibase/types"

export interface MockLLMResponseOpts {
  baseUrl?: string
  path?: string
  format?: ResponseFormat
  rejectFormat?: boolean
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => void
