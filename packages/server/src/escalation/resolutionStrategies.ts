import {
  EscalationResponse,
  ResolutionStrategy,
  Snippet,
} from "@budibase/types"
import { encodeJSBinding } from "@budibase/string-templates"

// Built-in escalation resolution strategies, authored as real (type-checked)
// functions and serialised to snippet bodies. Each reads the escalation context
// from the VM globals respond() injects (declared below) and returns an
// EscalationResponse to resolve, or false to leave the escalation open.

interface ResolutionStrategyFn {
  (): EscalationResponse | false
}

// VM globals the isolate injects at execution time - declared for type-checking
// only.
declare const responses: EscalationResponse[]
declare const totalRecipients: number
declare const actions: { approve: string; reject: string }

// istanbul ignore next: serialised via toString() and eval'd in an isolate, so
// coverage counters injected here would be undefined at execution time.
/* istanbul ignore next */
const firstResponse: ResolutionStrategyFn = () => {
  // The first recipient to respond decides the outcome. Unrecognised actions
  // resolve nothing - the escalation stays open.
  const outcomes: Record<string, boolean> = {
    [actions.approve]: true,
    [actions.reject]: false,
  }
  const first = responses && responses[0]
  if (!first) {
    return false
  }

  return Object.prototype.hasOwnProperty.call(outcomes, first.actionId)
    ? { accepted: outcomes[first.actionId], actionId: first.actionId }
    : false
}

/* istanbul ignore next */
const unanimous: ResolutionStrategyFn = () => {
  const rejected = responses.some(r => r.actionId === actions.reject)
  if (rejected) {
    return { accepted: false, actionId: actions.reject }
  }
  const allApproved =
    responses.length >= totalRecipients &&
    responses.every(r => r.actionId === actions.approve)
  return allApproved ? { accepted: true, actionId: actions.approve } : false
}

/* istanbul ignore next */
const majority: ResolutionStrategyFn = () => {
  const acceptedCount = responses.filter(
    r => r.actionId === actions.approve
  ).length
  const rejectCount = responses.length - acceptedCount
  if (acceptedCount > totalRecipients / 2) {
    return { accepted: true, actionId: actions.approve }
  }
  if (
    rejectCount > totalRecipients / 2 ||
    responses.length >= totalRecipients
  ) {
    return { accepted: false, actionId: actions.reject }
  }
  return false
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
  toStrategy(ResolutionStrategy.UNANIMOUS, unanimous),
  toStrategy(ResolutionStrategy.MAJORITY, majority),
]

// JS binding stored on an escalation to invoke a built-in strategy by name.
export const resolutionStrategyBinding = (name: ResolutionStrategy): string =>
  encodeJSBinding(`return snippets.${name}()`)
