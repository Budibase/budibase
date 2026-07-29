import { constants, db as dbCore, users } from "@budibase/backend-core"
import {
  AgentConversationLogConversation,
  AgentConversationLogDoc,
  AgentConversationLogEntry,
  AgentConversationLogRole,
  AgentConversationLogSearchParams,
  SearchFilters,
} from "@budibase/types"
import { Readable } from "stream"
import * as db from "../../db/agentConversationLogs"
import { isAuditLogsEnabled } from "../features"

const MIN_DATE = constants.MIN_VALID_DATE.toISOString()
const MAX_DATE = constants.MAX_VALID_DATE.toISOString()
const PAGE_SIZE = 20

export interface WriteAgentConversationLogEntry {
  messageId: string
  entryId: string
  timestamp: string
  role: AgentConversationLogRole
  text: string
  metadata?: Record<string, unknown>
}

export interface WriteAgentConversationLogOpts {
  conversationId: string
  agentId: string
  appId?: string
  userId: string
  channelProvider?: string
  transient?: boolean
  entries: WriteAgentConversationLogEntry[]
}

function fillDates(params: AgentConversationLogSearchParams) {
  if (params.startDate || params.endDate) {
    params.startDate = params.startDate || MIN_DATE
    params.endDate = params.endDate || MAX_DATE
  }
  return params
}

function getSearchFilters(params: AgentConversationLogSearchParams) {
  if (Array.isArray(params.appIds)) {
    params.appIds = params.appIds.map(appId => dbCore.getProdWorkspaceID(appId))
  }

  const filter: SearchFilters = {}
  function addStringParams(key: string, params: string[] | undefined) {
    if (params?.length) {
      filter.oneOf = {
        ...filter.oneOf,
        [key]: params,
      }
    }
  }
  addStringParams("userId", params.userIds)
  addStringParams("appId", params.appIds)
  addStringParams("agentId", params.agentIds)
  addStringParams("channelProvider", params.channelProviders)

  if (params.fullSearch) {
    filter.fuzzyOr = true
    filter.fuzzy = {
      text: params.fullSearch,
      metadata: params.fullSearch,
    }
  }
  if (params.startDate || params.endDate) {
    params = fillDates(params)
    filter.range = {
      timestamp: {
        high: params.endDate!,
        low: params.startDate!,
      },
    }
  }
  if (Object.keys(filter).length === 0) {
    filter.notEmpty = {
      conversationId: true,
    }
  }
  return filter
}

function sortDocs(docs: AgentConversationLogDoc[]) {
  return docs.sort((a, b) => {
    if (a.conversationId !== b.conversationId) {
      return a.conversationId < b.conversationId ? -1 : 1
    }
    if (a.timestamp !== b.timestamp) {
      return a.timestamp < b.timestamp ? -1 : 1
    }
    return a.entryId < b.entryId ? -1 : 1
  })
}

async function assemble(
  docs: AgentConversationLogDoc[]
): Promise<AgentConversationLogConversation[]> {
  const conversations = new Map<string, AgentConversationLogConversation>()

  for (let doc of sortDocs(docs)) {
    let conversation = conversations.get(doc.conversationId)
    const entry: AgentConversationLogEntry = {
      messageId: doc.messageId,
      entryId: doc.entryId,
      timestamp: doc.timestamp,
      role: doc.role,
      text: doc.text,
      ...(doc.metadata ? { metadata: doc.metadata } : {}),
    }

    if (!conversation) {
      conversation = {
        conversationId: doc.conversationId,
        agentId: doc.agentId,
        appId: doc.appId,
        userId: doc.userId,
        channelProvider: doc.channelProvider,
        transient: doc.transient,
        startTime: doc.timestamp,
        lastActivityAt: doc.timestamp,
        entries: [entry],
      }
      conversations.set(doc.conversationId, conversation)
      continue
    }

    conversation.entries.push(entry)
    if (doc.timestamp < conversation.startTime) {
      conversation.startTime = doc.timestamp
    }
    if (doc.timestamp > conversation.lastActivityAt) {
      conversation.lastActivityAt = doc.timestamp
    }
  }

  const data = [...conversations.values()].sort((a, b) =>
    a.lastActivityAt > b.lastActivityAt ? -1 : 1
  )

  const userIds = [...new Set(data.map(log => log.userId))]
  const appIds = [
    ...new Set(
      data
        .map(log => log.appId)
        .filter((appId): appId is string => typeof appId === "string")
        .map(appId => dbCore.getDevWorkspaceID(appId))
    ),
  ]
  const userList = await users.bulkGetGlobalUsersById(userIds, {
    cleanup: true,
  })
  const workspaceList = await dbCore.getWorkspacesByIDs(appIds)

  return data.map(log => ({
    ...log,
    user: userList.find(user => user?._id === log.userId),
    app: workspaceList.find(workspace =>
      dbCore.isSameWorkspaceID(workspace?.appId, log.appId)
    ),
  }))
}

export async function write(opts: WriteAgentConversationLogOpts) {
  if (!(await isAuditLogsEnabled()) || !opts.entries.length) {
    return
  }

  await Promise.all(
    opts.entries.map(entry => {
      const doc: AgentConversationLogDoc = {
        type: "agentConversationLog",
        conversationId: opts.conversationId,
        messageId: entry.messageId,
        entryId: entry.entryId,
        agentId: opts.agentId,
        appId: opts.appId ? dbCore.getProdWorkspaceID(opts.appId) : undefined,
        userId: opts.userId,
        timestamp: entry.timestamp,
        role: entry.role,
        text: entry.text,
        channelProvider: opts.channelProvider || "Chat",
        transient: opts.transient,
        metadata: entry.metadata,
      }
      return db.save(doc)
    })
  )
}

export async function fetch(params: AgentConversationLogSearchParams) {
  if (!(await isAuditLogsEnabled())) {
    throw new Error("Agent conversation logs not available.")
  }

  const bookmark = params.bookmark ? Number.parseInt(params.bookmark, 10) : 1
  const docs = await db.searchAll(getSearchFilters(params))
  const conversations = await assemble(docs)
  const start = (bookmark - 1) * PAGE_SIZE
  const page = conversations.slice(start, start + PAGE_SIZE)
  const hasNextPage = conversations.length > start + PAGE_SIZE

  return {
    hasNextPage,
    bookmark: hasNextPage ? bookmark + 1 : undefined,
    data: page,
  }
}

export async function download(
  params: AgentConversationLogSearchParams
): Promise<{
  stream: Readable
}> {
  if (!(await isAuditLogsEnabled())) {
    throw new Error("Agent conversation logs not available.")
  }

  const docs = await db.searchAll(getSearchFilters(fillDates(params)))
  const conversations = await assemble(docs)
  const lines = conversations.map(conversation => JSON.stringify(conversation))
  return {
    stream: Readable.from(lines.map(line => `${line}\n`)),
  }
}
