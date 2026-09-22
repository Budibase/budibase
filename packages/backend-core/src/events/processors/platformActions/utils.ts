import { DocumentType, SEPARATOR } from "@budibase/types"
import type {
  ActionSourceContext,
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"
import { isDevWorkspaceID } from "../../../docIds/conversions"

function encodeKeyPart(value: string): string {
  return encodeURIComponent(value)
}

export function getPlatformActionEnvironment(
  workspaceId: string
): PlatformActionEnvironment {
  return isDevWorkspaceID(workspaceId) ? "dev" : "prod"
}

export function getPlatformActionSessionId({
  environment,
  sourceType,
  sourceId,
}: ActionSourceContext & {
  environment: PlatformActionEnvironment
}): string {
  return `${DocumentType.PLATFORM_ACTION_SESSION}${SEPARATOR}${environment}${SEPARATOR}${encodeKeyPart(
    sourceType
  )}${SEPARATOR}${encodeKeyPart(sourceId)}`
}

export interface PlatformActionSessionInput extends ActionSourceContext {
  environment: PlatformActionEnvironment
  status: PlatformActionContainerStatus
  startedAt: string
  statusUpdatedAt: string
  actionCount: number
  assetType?: string
  assetId?: string
  assetLabel?: string
  triggeredByType?: string
  triggeredById?: string
  triggeredByLabel?: string
}

// updatedAt is intentionally absent here: DatabaseImpl.put() unconditionally
// stamps it with the real write time on every put(), so any value set here
// would just be discarded before the doc is ever read back.
export function buildPlatformActionSession(
  input: PlatformActionSessionInput
): Omit<PlatformActionSessionIndexDoc, "updatedAt"> {
  return {
    _id: getPlatformActionSessionId(input),
    ...input,
  }
}
