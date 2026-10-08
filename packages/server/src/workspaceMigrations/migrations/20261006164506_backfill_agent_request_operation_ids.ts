import { context, docIds } from "@budibase/backend-core"
import { DocumentType } from "@budibase/types"
import type {
  Agent,
  AgentRequest,
  AgentRequestEntry,
  Document,
} from "@budibase/types"

interface LegacyAgentRequest extends Omit<AgentRequest, "entries"> {
  entries: Array<AgentRequestEntry & { operationNames?: string[] }>
}

async function* pagedDocuments<T extends Document>({
  documentType,
}: {
  documentType: DocumentType
}) {
  const db = context.getWorkspaceDB()
  const params = docIds.getDocParams(documentType, undefined, {
    include_docs: true,
    limit: 100,
  })
  let cursor: string | undefined
  while (true) {
    const { rows } = await db.allDocs<T>({
      ...params,
      ...(cursor ? { startkey: cursor, skip: 1 } : {}),
    })
    const lastRow = rows[rows.length - 1]
    if (!lastRow) {
      return
    }
    for (const { doc } of rows) {
      if (doc) {
        yield doc
      }
    }
    cursor = lastRow.id
  }
}

const migration = async () => {
  const db = context.getWorkspaceDB()
  const agents = new Map<string, Agent>()
  for await (const agent of pagedDocuments<Agent>({
    documentType: DocumentType.AGENT,
  })) {
    if (agent._id) {
      agents.set(agent._id, agent)
    }
  }

  for await (const request of pagedDocuments<LegacyAgentRequest>({
    documentType: DocumentType.AGENT_REQUEST,
  })) {
    if (
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
