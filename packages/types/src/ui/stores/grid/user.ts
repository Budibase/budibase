import { User } from "@budibase/types"

export interface UIUser extends User {
  sessionId: string
  gridMetadata?: { focusedCellId?: string }
}

export interface UIEnrichedUser extends UIUser {
  color: string
  label: string
}
