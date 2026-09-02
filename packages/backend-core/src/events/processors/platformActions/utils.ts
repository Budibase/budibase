import { DocumentType, SEPARATOR } from "@budibase/types"
import type {
  ActionSourceContext,
  PlatformActionContainerStatus,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"

function encodeKeyPart(value: string): string {
  return encodeURIComponent(value)
}

export function getPlatformActionSessionId({
  sourceType,
  sourceId,
}: ActionSourceContext): string {
  return `${DocumentType.PLATFORM_ACTION_SESSION}${SEPARATOR}${encodeKeyPart(
    sourceType
  )}${SEPARATOR}${encodeKeyPart(sourceId)}`
}

export interface PlatformActionSessionInput extends ActionSourceContext {
  status: PlatformActionContainerStatus
  startedAt: string
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
