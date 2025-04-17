import { ResponseFormat } from "@budibase/types"
import { Scope } from "nock"

export interface MockLLMResponseOpts {
  host?: string
  format?: ResponseFormat
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => Scope
