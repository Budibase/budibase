import { User } from "@budibase/types"

export interface UIUser extends User {
  sessionId: string
  gridMetadata?: { focusedCellId?: string }
  builderMetadata?: { selectedResourceId?: string }
}
