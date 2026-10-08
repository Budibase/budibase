import { DocumentType, SEPARATOR } from "@budibase/types"
import type {
  ActionSourceContext,
  PlatformActionAssetType,
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionOriginType,
  PlatformActionSessionIndexDoc,
  PlatformActionSessionMetadata,
} from "@budibase/types"

function encodeKeyPart(value: string): string {
  return encodeURIComponent(value)
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
  assetType?: PlatformActionAssetType
  assetId?: string
  assetLabel?: string
  assetCapturedAt?: string
  triggeredByType?: PlatformActionOriginType
  triggeredById?: string
  triggeredByLabel?: string
  triggeredByCapturedAt?: string
}

type SessionMetadataFields = Pick<
  PlatformActionSessionIndexDoc,
  | "assetType"
  | "assetId"
  | "assetLabel"
  | "assetCapturedAt"
  | "triggeredByType"
  | "triggeredById"
  | "triggeredByLabel"
  | "triggeredByCapturedAt"
>

const isEarlierCapture = (timestamp: string, capturedAt?: string) =>
  !capturedAt || Date.parse(timestamp) < Date.parse(capturedAt)

// Earliest capture wins per group, by job timestamp rather than delivery
// order, so a delayed job from before a rename still restores the original
// snapshot. Jobs without metadata never clear it, and each group is written
// as a whole so its fields can't come from different captures.
export function getSessionMetadataFields({
  metadata,
  timestamp,
  existing,
}: {
  metadata?: PlatformActionSessionMetadata
  timestamp: string
  existing?: SessionMetadataFields
}): SessionMetadataFields {
  const fields: SessionMetadataFields = {}
  const { asset, triggeredBy } = metadata ?? {}
  if (asset && isEarlierCapture(timestamp, existing?.assetCapturedAt)) {
    fields.assetType = asset.type
    fields.assetId = asset.id
    fields.assetLabel = asset.label
    fields.assetCapturedAt = timestamp
  }
  if (
    triggeredBy &&
    isEarlierCapture(timestamp, existing?.triggeredByCapturedAt)
  ) {
    fields.triggeredByType = triggeredBy.type
    fields.triggeredById =
      "id" in triggeredBy && triggeredBy.id ? triggeredBy.id : undefined
    fields.triggeredByLabel =
      "label" in triggeredBy && triggeredBy.label
        ? triggeredBy.label
        : undefined
    fields.triggeredByCapturedAt = timestamp
  }
  return fields
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
