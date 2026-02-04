import {
  cache,
  db as dbCore,
  logging,
  users,
  utils,
} from "@budibase/backend-core"
import {
  AuditedEventFriendlyName,
  AuditLogDoc,
  AuditLogEnriched,
  AuditLogSearchParams,
  AuditLogSystemUser,
  AuditWriteOpts,
  Event,
  FallbackInfo,
  SearchFilters,
} from "@budibase/types"
import { Readable } from "stream"
import * as auditLogs from "../../db/auditLogs"
import { isAuditLogsEnabled } from "../features"
import {
  deleted,
  fillDates,
  getEventFriendlyName,
  getSearchFilters,
  removeTemplateStrings,
  ResourceType,
} from "./utils"

export async function write(
  event: Event,
  metadata: any,
  opts?: AuditWriteOpts
): Promise<AuditLogDoc | undefined> {
  if (!(await isAuditLogsEnabled()) || !utils.isAudited(event)) {
    return
  }
  const friendly = getEventFriendlyName(event, metadata)
  let date = new Date()
  if (opts?.timestamp) {
    date = new Date(opts.timestamp)
  }
  const doc: AuditLogDoc = {
    timestamp: date.toISOString(),
    event,
    name: friendly,
    userId: opts?.userId || AuditLogSystemUser,
    metadata: {
      ...metadata,
      ...opts?.hostInfo,
    },
  }
  const fallback: FallbackInfo = {}
  // audit logs always use prod app ID
  try {
    if (opts?.appId) {
      doc.appId = dbCore.getProdWorkspaceID(opts.appId)
      const appMetadata = await cache.workspace.getWorkspaceMetadata(opts.appId)
      if ("name" in appMetadata) {
        fallback.appName = appMetadata.name
      }
    }
    if (opts?.userId) {
      const user = await users.getById(opts?.userId as string)
      fallback.email = user.email
    }
  } catch (err) {
    logging.logAlert(
      "Failed to retrieve fallback information for audit log",
      err
    )
  }
  doc.fallback = fallback
  return await auditLogs.save(doc)
}

async function enrich(logs: AuditLogDoc[]): Promise<AuditLogEnriched[]> {
  const allUserIds = logs.map(log => log.userId)
  const hasAppIdLogs = logs.filter(log => log.appId)
  // get the dev app ID - enrich with dev app info as prod app may not exist
  const allAppIds = hasAppIdLogs.map(log =>
    dbCore.getDevWorkspaceID(log.appId as string)
  )
  const userList = await users.bulkGetGlobalUsersById(
    [...new Set(allUserIds)],
    { cleanup: true }
  )
  const workspaceList = await dbCore.getWorkspacesByIDs([...new Set(allAppIds)])

  let enriched: AuditLogEnriched[] = []
  for (let log of logs) {
    const user = userList.find(user => user?._id === log.userId)
    const workspace = workspaceList.find(workspace =>
      dbCore.isSameWorkspaceID(workspace?.appId, log.appId)
    )
    const enrichedLog: AuditLogEnriched = {
      event: log.event,
      timestamp: log.timestamp,
      name: log.name,
      metadata: log.metadata,
      user: user || deleted(log.userId, ResourceType.USER, log.fallback),
    }
    if (log.appId) {
      enrichedLog.app =
        workspace || deleted(log.appId, ResourceType.APP, log.fallback)
    }
    enriched.push(enrichedLog)
  }
  return enriched
}

export async function fetch(params: AuditLogSearchParams) {
  if (!(await isAuditLogsEnabled())) {
    throw new Error("Audit logs not available - license required.")
  }

  const filter: SearchFilters = await getSearchFilters(params)

  if (typeof params.bookmark === "string") {
    throw new Error("String based bookmark not supported.")
  }

  const response = await auditLogs.searchSQL(filter, params.bookmark)
  return {
    hasNextPage: response.hasNextPage,
    bookmark: response.bookmark,
    data: await enrich(response.rows),
  }
}

// like the fetch, but without pagination (uses filtered replication)
export function download(params: AuditLogSearchParams): {
  promise: Promise<void>
  stream: Readable
} {
  params = fillDates(params)
  return auditLogs.dump(params)
}

export function definitions() {
  const entries = Object.entries(AuditedEventFriendlyName).filter(
    entry => entry[1] != undefined
  )
  const events: Record<string, string> = {}
  for (let entry of entries) {
    events[entry[0]] = removeTemplateStrings(entry[1] as string)
  }
  return events
}
