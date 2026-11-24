import type { WorkspaceBackup, WorkspaceBackupContents } from "@budibase/types"

export type BackupTableRow = Omit<WorkspaceBackup, "contents"> &
  Partial<WorkspaceBackupContents>

export type BackupTableAction =
  | {
      type: "backupDelete"
      backupId: string
    }
  | {
      type: "backupRestore"
      backupId: string
      restoreBackupName: string
    }
