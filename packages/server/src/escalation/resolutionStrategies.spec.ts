import { EscalationAction, ResolutionStrategy } from "@budibase/types"
import { decodeJSBinding, iifeWrapper } from "@budibase/string-templates"
import { IsolatedVM } from "../jsRunner/vm"
import {
  RESOLUTION_STRATEGY_SNIPPETS,
  resolutionStrategyBinding,
} from "./resolutionStrategies"

const A = EscalationAction.APPROVE
const R = EscalationAction.REJECT

const run = (
  strategy: ResolutionStrategy,
  actionIds: string[],
  totalRecipients: number
) => {
  const vm = new IsolatedVM().withSnippets(RESOLUTION_STRATEGY_SNIPPETS)
  const code = decodeJSBinding(resolutionStrategyBinding(strategy))!
  return vm.withContext(
    {
      responses: actionIds.map(actionId => ({ actionId })),
      totalRecipients,
      actions: { approve: A, reject: R },
    },
    () => vm.execute(iifeWrapper(code))
  )
}

const approved = { accepted: true, actionId: A }
const rejected = { accepted: false, actionId: R }

describe("resolution strategies", () => {
  describe("first_response", () => {
    it.each([
      [[], false],
      [[A], approved],
      [[R], rejected],
      [[R, A], rejected],
      [["constructor"], false],
    ])("%j -> %j", (actions, expected) => {
      expect(run(ResolutionStrategy.FIRST_RESPONSE, actions, 2)).toEqual(
        expected
      )
    })
  })

  describe("unanimous", () => {
    it.each([
      [[A], 2, false],
      [[A, A], 2, approved],
      [[A, R], 2, rejected],
      [[R], 3, rejected],
      [[A, A], 3, false],
      [[A, A, R], 3, rejected],
      [[A, A, A, A, A], 5, approved],
    ])("%j of %i -> %j", (actions, total, expected) => {
      expect(run(ResolutionStrategy.UNANIMOUS, actions, total)).toEqual(
        expected
      )
    })
  })

  describe("majority", () => {
    it.each([
      [[A], 3, false],
      [[A, A], 3, approved],
      [[A, R], 3, false],
      [[A, R, A], 3, approved],
      [[R, R], 3, rejected],
      [[A, R, A, R], 4, rejected],
      [[A, A, A], 4, approved],
      [[R, R, R], 5, rejected],
      [[A, R, A, R], 5, false],
      [[A, R, A, R, A], 5, approved],
      [[R, A, R, A, R], 5, rejected],
      [[A, R, A, R, R], 5, rejected],
    ])("%j of %i -> %j", (actions, total, expected) => {
      expect(run(ResolutionStrategy.MAJORITY, actions, total)).toEqual(expected)
    })
  })
})
