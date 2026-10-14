import type { UserGroup } from "../documents/global/userGroup"
import type { Document } from "../documents/document"
import type { Identity } from "./events/identification"

export interface UserGroupMembershipEvent {
  id: string
  action: "added" | "removed"
  group: UserGroup
  identity: Identity
  timestamp: number
}

export interface UserGroupEventOutbox extends Document {
  userId: string
  sourceUserRev: string
  pendingGroupEvents: UserGroupMembershipEvent[]
}

export interface SaveUserOpts {
  hashPassword?: boolean
  requirePassword?: boolean
  currentUserId?: string
  skipPasswordValidation?: boolean
  skipPasswordRegexValidation?: boolean
  allowChangingEmail?: boolean
  isAccountHolder?: boolean
  assignDefaultGroup?: boolean
  groupMembershipEvents?: UserGroupMembershipEvent[]
}
