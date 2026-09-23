import { Workspace } from "@budibase/types"

export type WorkspaceTemplate =
  | {
      fromFile: true
    }
  | {
      key: string
      name: string
      fromFile: false
      image: string
      background: string
      icon: string
    }

export interface WorkspaceIdentifierMetadata {
  devId?: string
  devRev?: string
  prodId?: string
  prodRev?: string
}

export interface WorkspaceUIMetadata {
  deployed: boolean
  lockedYou: boolean
  lockedOther: boolean
  favourite: boolean
  editable: boolean
}

export interface StoreWorkspace extends Workspace, WorkspaceIdentifierMetadata {
  defaultWorkspaceAppUrl: string
}

export interface EnrichedWorkspace
  extends StoreWorkspace,
    WorkspaceUIMetadata {}
