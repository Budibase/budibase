import { WorkspaceBackupContents } from "@budibase/types"

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

type ExportAppFn = (devAppId: string, opts: { tar: boolean }) => Promise<string>
type ImportAppFn = (
  devAppId: string,
  db: any,
  config: ImportAppConfig
) => Promise<string>
type StatsFn = (devAppId: string) => Promise<WorkspaceBackupContents>

export interface BackupProcessingOpts {
  exportAppFn: ExportAppFn
  importAppFn: ImportAppFn
  statsFn: StatsFn
}
