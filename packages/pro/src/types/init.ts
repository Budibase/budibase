import { Database, WorkspaceBackupContents } from "@budibase/types"

export interface InitOpts {
  backups?: BackupInitOpts
}

// BACKUPS

export interface BackupInitOpts {
  processing: BackupProcessingOpts
}

export interface ImportWorkspaceConfig {
  file?: {
    type?: string
    path: string
    password?: string
  }
  key?: string
}

export interface ImportWorkspaceOpts {
  updateAttachmentColumns?: boolean
  importObjStoreContents?: boolean
  objectStoreAppId?: string
}

export type ExportWorkspaceFn = (
  devWorkspaceId: string,
  opts: {
    tar: boolean
    excludeRows?: boolean
    encryptPassword?: string
    exportPath?: string
    filter?: string
  }
) => Promise<string>
export type ImportWorkspaceFn = (
  targetWorkspaceId: string,
  destinationDb: Database,
  config: ImportWorkspaceConfig,
  opts?: ImportWorkspaceOpts
) => Promise<string>
type StatsFn = (devWorkspaceId: string) => Promise<WorkspaceBackupContents>

export interface BackupProcessingOpts {
  exportWorkspaceFn: ExportWorkspaceFn
  importWorkspaceFn: ImportWorkspaceFn
  statsFn: StatsFn
}
