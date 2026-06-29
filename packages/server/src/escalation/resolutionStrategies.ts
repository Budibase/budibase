import { EscalationResponse, ResolutionStrategy, Snippet } from "@budibase/types"
import { encodeJSBinding } from "@budibase/string-templates"

// Built-in escalation resolution strategies, authored as real (type-checked)
// functions and serialised to snippet bodies. Each reads the escalation context
// from the VM globals respond() injects (declared below) and returns an
// EscalationResponse to resolve, or false to leave the escalation open.

// VM-injected escalation context. Declared (not emitted) for type-checking - the
// isolate provides these as globals at execution time.
declare const responses: EscalationResponse[]
declare const totalRecipients: number

interface ResolutionStrategyFn {
  (): EscalationResponse | false
}

// The first recipient to respond decides the outcome and resolves the escalation
const firstResponse: ResolutionStrategyFn = () => {
  const first = responses && responses[0]
  return first
    ? {
        accepted: String(first.actionId).indexOf("approve") !== -1,
        actionId: first.actionId,
      }
    : false
}

const toStrategy = (
  name: ResolutionStrategy,
  fn: ResolutionStrategyFn
): Snippet => ({
  name,
  // The snippet bundle IIFE-evals this, so it must `return` the callable.
  code: `return ${fn.toString()}`,
})

export const RESOLUTION_STRATEGY_SNIPPETS: Snippet[] = [
  toStrategy(ResolutionStrategy.FIRST_RESPONSE, firstResponse),
]

// The resolutionStrategy value to store on an escalation to invoke a built-in
// strategy by name (a JS binding calling the snippet). Keeps the calling
// convention in one place rather than in each caller.
export const resolutionStrategyBinding = (name: ResolutionStrategy): string =>
  encodeJSBinding(`return snippets.${name}()`)
