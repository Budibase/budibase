import {
  DocumentType,
  PermissionLevel,
  VirtualDocumentType,
} from "@budibase/types"
import { isViewID } from "../../../db/utils"
import { features } from "@budibase/pro"

type ResourceActionAllowedResult =
  | { allowed: true }
  | {
      allowed: false
      level: PermissionLevel
      resourceType: DocumentType | VirtualDocumentType
    }

export async function resourceActionAllowed({
  resourceId,
  level,
}: {
  resourceId: string
  level: PermissionLevel
}): Promise<ResourceActionAllowedResult> {
  if (!isViewID(resourceId)) {
    return { allowed: true }
  }

  if (await features.isViewPermissionEnabled()) {
    return { allowed: true }
  }

  return {
    allowed: false,
    level,
    resourceType: VirtualDocumentType.VIEW,
  }
}
