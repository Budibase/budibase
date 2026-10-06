import { context, docIds } from "@budibase/backend-core"
import { DocumentType } from "@budibase/types"
import type { Agent, AgentRequest, AgentRequestEntry } from "@budibase/types"

interface LegacyAgentRequest extends Omit<AgentRequest, "entries"> {
  entries: Array<AgentRequestEntry & { operationNames?: string[] }>
}

const migration = async () => {
  const db = context.getWorkspaceDB()
  const [requestDocs, agentDocs] = await Promise.all([
    db.allDocs<LegacyAgentRequest>(
      docIds.getDocParams(DocumentType.AGENT_REQUEST, undefined, {
        include_docs: true,
      })
    ),
    db.allDocs<Agent>(
      docIds.getDocParams(DocumentType.AGENT, undefined, {
        include_docs: true,
      })
    ),
  ])
  const agents = new Map<string, Agent>()
  for (const { doc } of agentDocs.rows) {
    if (doc?._id) {
      agents.set(doc._id, doc)
    }
  }

  for (const { doc: request } of requestDocs.rows) {
    if (
      !request ||
      request.operationId ||
      (request.status !== "active" && request.status !== "needs_input")
    ) {
      continue
    }
    const names = new Set(
      request.entries.flatMap(entry => entry.operationNames ?? [])
    )
    if (names.size !== 1) {
      continue
    }
    const operations = agents
      .get(request.agentId)
      ?.operations?.filter(operation => names.has(operation.name))
    if (operations?.length !== 1) {
      continue
    }
    await db.put({ ...request, operationId: operations[0].id })
  }
}

export default migration
