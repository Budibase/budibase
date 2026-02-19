import { ResponseFormat } from "@budibase/types"

export interface MockLLMResponseOpts {
  baseUrl?: string
  format?: ResponseFormat
  rejectFormat?: boolean
  times?: number
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => void
