import { Database, WorkspaceBackupContents } from "@budibase/types"

export interface InitOpts {
  backups?: BackupInitOpts
}

// BACKUPS

export interface BackupInitOpts {
  processing: BackupProcessingOpts
}

export interface ImportAppConfig {
  file: {
    type: string
    path: string
  }
  key: string
}

export interface ImportAppOpts {
  updateAttachmentColumns?: boolean
  importObjStoreContents?: boolean
  objectStoreAppId?: string
}

type ExportAppFn = (devAppId: string, opts: { tar: boolean }) => Promise<string>
type ImportAppFn = (
  targetWorkspaceId: string,
  destinationDb: Database,
  config: ImportAppConfig,
  opts?: ImportAppOpts
) => Promise<string>
type StatsFn = (devAppId: string) => Promise<WorkspaceBackupContents>

export interface BackupProcessingOpts {
  exportAppFn: ExportAppFn
  importAppFn: ImportAppFn
  statsFn: StatsFn
}
