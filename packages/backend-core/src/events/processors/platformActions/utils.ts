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
  assetType?: string
  assetId?: string
  assetLabel?: string
  triggeredByType?: string
  triggeredById?: string
  triggeredByLabel?: string
}

export function buildPlatformActionSession(
  input: PlatformActionSessionInput
): PlatformActionSessionIndexDoc {
  return {
    _id: getPlatformActionSessionId(input),
    actionCount: 1,
    updatedAt: input.startedAt,
    ...input,
  }
}
