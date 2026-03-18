import { docIds } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { Agent } from "@budibase/types"

export function basicAgent(props: Partial<Agent> = {}): Agent {
  return {
    name: generator.guid(),
    aiconfig: generator.guid(),
    _id: docIds.generateAgentID(),
    ...props,
  }
}
