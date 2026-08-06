import { Workspace } from "@budibase/types"

export type AppTemplate =
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

export interface AppIdentifierMetadata {
  devId?: string
  devRev?: string
  prodId?: string
  prodRev?: string
}

export interface AppUIMetadata {
  deployed: boolean
  lockedYou: boolean
  lockedOther: boolean
  favourite: boolean
  editable: boolean
}

export interface StoreApp extends Workspace, AppIdentifierMetadata {
  defaultWorkspaceAppUrl: string
}

export interface EnrichedApp extends StoreApp, AppUIMetadata {}
