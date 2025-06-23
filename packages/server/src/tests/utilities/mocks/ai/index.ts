import { Scope } from "nock"

export interface MockLLMResponseOpts {
  baseUrl?: string
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => Scope
