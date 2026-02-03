import { constants, db as dbCore } from "@budibase/backend-core"
import { findHBSBlocks, processStringSync } from "@budibase/string-templates"
import {
  AuditedEventFriendlyName,
  AuditLogResourceStatus,
  AuditLogSearchParams,
  DeletedResourceInfo,
  Event,
  FallbackInfo,
  SearchFilters,
} from "@budibase/types"

const MIN_DATE = constants.MIN_VALID_DATE.toISOString()
const MAX_DATE = constants.MAX_VALID_DATE.toISOString()

export enum ResourceType {
  USER = "user",
  APP = "app",
}

export function fillDates(params: AuditLogSearchParams) {
  if (params.startDate || params.endDate) {
    params.startDate = params.startDate || MIN_DATE
    params.endDate = params.endDate || MAX_DATE
  }
  return params
}

export async function getSearchFilters(params: AuditLogSearchParams) {
  // look for prod app IDs in audit log documents
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
  addStringParams("event", params.events)

  if (params.fullSearch) {
    // new SQL based search
    filter.fuzzyOr = true
    filter.fuzzy = {
      name: params.fullSearch,
      fallback: params.fullSearch,
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
  // no parameters, search for anything
  if (Object.keys(filter).length === 0) {
    filter.notEmpty = {
      event: true,
    }
  }
  return filter
}

export function deleted(
  id: string,
  resourceType: ResourceType,
  fallbackInfo?: FallbackInfo
) {
  const deleteInfo: DeletedResourceInfo = {
    _id: id,
    status: AuditLogResourceStatus.DELETED,
  }
  switch (resourceType) {
    case ResourceType.APP:
      deleteInfo.name = fallbackInfo?.appName
      break
    case ResourceType.USER:
      deleteInfo.email = fallbackInfo?.email
      break
  }
  return deleteInfo
}

export function removeTemplateStrings(friendlyName: string) {
  const blocks = findHBSBlocks(friendlyName)
  // remove any HBS blocks
  for (let block of blocks) {
    const quoted = ` "${block}"`
    friendlyName = friendlyName.replace(
      friendlyName.includes(quoted) ? quoted : ` ${block}`,
      ""
    )
    // Remove template strings
    friendlyName = processStringSync(friendlyName, {})
  }
  return friendlyName
}

export function getEventFriendlyName(event: Event, metadata: any) {
  const friendly = AuditedEventFriendlyName[event]
  if (!friendly) {
    throw new Error("No friendly name found.")
  }
  let processed = processStringSync(friendly, metadata)
  // this will occur if no enrichment could be found
  if (processed.includes(`""`)) {
    processed = removeTemplateStrings(friendly)
  }
  return processed
}
