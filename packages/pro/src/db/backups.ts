import {
  db as dbCore,
  tenancy,
  users as userCore,
} from "@budibase/backend-core"
import {
  AllDocsResponse,
  BackupFetchOpts,
  BackupTrigger,
  BackupType,
  ConstantQuotaName,
  Database,
  DatabaseQueryOpts,
  PutResponse,
  WorkspaceBackup,
  WorkspaceBackupMetadata,
} from "@budibase/types"
import { GENERIC_PAGE_SIZE } from "../constants"
import { pagination } from "./utils/pagination"
import { getOldestRetentionDate } from "./utils/retention"
import { createWorkspaceBackupTriggerView } from "./utils/views"

type FilterOpts = {
  startDate?: string
  endDate?: string
  trigger?: BackupTrigger
  type?: BackupType
}

export async function oldestBackupDate() {
  return getOldestRetentionDate(
    ConstantQuotaName.WORKSPACE_BACKUPS_RETENTION_DAYS
  )
}

const WORKSPACE_BACKUP_PREFIX = `${dbCore.DocumentType.WORKSPACE_BACKUP}${dbCore.SEPARATOR}`

async function getWorkspaceBackupParams(
  workspaceId: string,
  filters: FilterOpts,
  otherProps: DatabaseQueryOpts = {}
) {
  const maxStartDate = await oldestBackupDate()
  const prodWorkspaceId = dbCore.getProdWorkspaceID(workspaceId)
  let startKey = prodWorkspaceId,
    endKey = prodWorkspaceId
  if (filters.trigger && filters.type) {
    let basePart = `${dbCore.SEPARATOR}${filters.trigger}`
    basePart += `${dbCore.SEPARATOR}${filters.type}`
    startKey += basePart
    endKey += basePart
  }
  // check start date within limits
  if (!filters.startDate || filters.startDate < maxStartDate) {
    filters.startDate = maxStartDate
  }
  if (filters.startDate) {
    endKey += `${dbCore.SEPARATOR}${filters.startDate}`
  }
  if (filters.endDate) {
    startKey += `${dbCore.SEPARATOR}${filters.endDate}`
  }
  return {
    ...otherProps,
    descending: true,
    startkey: `${WORKSPACE_BACKUP_PREFIX}${startKey}${dbCore.UNICODE_MAX}`,
    endkey: `${WORKSPACE_BACKUP_PREFIX}${endKey}`,
  }
}

async function getWorkspaceBackupsByTrigger(
  db: Database,
  params: DatabaseQueryOpts
): Promise<AllDocsResponse<WorkspaceBackup>> {
  try {
    const queryIndex = dbCore.getQueryIndex(
      dbCore.ViewName.WORKSPACE_BACKUP_BY_TRIGGER
    )
    const backups = await db.query<WorkspaceBackup>(queryIndex, params)
    return backups
  } catch (err: any) {
    if (err != null && err.error === "not_found") {
      await createWorkspaceBackupTriggerView()
      return getWorkspaceBackupsByTrigger(db, params)
    } else {
      throw err
    }
  }
}

export function generateWorkspaceBackupID(
  workspace: string,
  timestamp: string
) {
  return `${WORKSPACE_BACKUP_PREFIX}${workspace}${dbCore.SEPARATOR}${timestamp}`
}

export async function fetchWorkspaceBackups(
  workspaceId: string,
  opts: BackupFetchOpts = {}
) {
  const db = tenancy.getGlobalDB()
  let backups
  const pageSize = opts.limit || GENERIC_PAGE_SIZE
  const params = await getWorkspaceBackupParams(workspaceId, opts, {
    include_docs: true,
    limit: pageSize + 1,
  })
  if (opts.page) {
    params.startkey = opts.page
  }
  if (!opts.trigger || !opts.type) {
    backups = await db.allDocs<WorkspaceBackup>(params)
  } else {
    backups = await getWorkspaceBackupsByTrigger(db, params)
  }
  const pageData = pagination(backups, {
    paginate: opts.paginate,
    pageSize,
  })
  // add in users
  const userIds = [
    ...new Set(
      pageData.data
        .filter(backup => backup.createdBy)
        .map(backup => backup.createdBy!)
    ),
  ] as string[]
  const users = await userCore.bulkGetGlobalUsersById(userIds, {
    cleanup: true,
  })
  for (let user of users) {
    for (let data of pageData.data) {
      if (user?._id === data.createdBy) {
        data.createdBy = user
      }
    }
  }
  return pageData
}

export async function storeWorkspaceBackupMetadata(
  metadata: WorkspaceBackupMetadata,
  opts: { filename?: string; docId?: string; docRev?: string } = {}
) {
  const db = tenancy.getGlobalDB()
  const prodWorkspaceId = dbCore.getProdWorkspaceID(metadata.appId)
  let _id = generateWorkspaceBackupID(prodWorkspaceId, metadata.timestamp)
  const workspaceBackupDoc: WorkspaceBackup = {
    ...metadata,
    _id,
    appId: prodWorkspaceId,
    name: metadata.name,
  }
  workspaceBackupDoc._id = opts.docId || workspaceBackupDoc._id
  workspaceBackupDoc._rev = opts.docRev || workspaceBackupDoc._rev
  if (opts.filename) {
    workspaceBackupDoc.filename = opts.filename
  }
  if (metadata.createdBy) {
    workspaceBackupDoc.createdBy = dbCore.getGlobalIDFromUserMetadataID(
      metadata.createdBy as string
    )
  }
  return (await db.put(workspaceBackupDoc)) as PutResponse
}

export async function updateWorkspaceBackupMetadata(
  backupId: string,
  name: string
) {
  const db = tenancy.getGlobalDB()
  const metadata = (await db.get(backupId)) as WorkspaceBackup
  metadata.name = name
  return (await db.put(metadata)) as PutResponse
}

export async function deleteWorkspaceBackupMetadata(backupId: string) {
  const db = tenancy.getGlobalDB()
  const backupDoc = await db.get<WorkspaceBackup>(backupId)
  await db.remove(backupDoc._id, backupDoc._rev)
}

export async function getWorkspaceBackupMetadata(backupId: string) {
  const db = tenancy.getGlobalDB()
  return (await db.get(backupId)) as WorkspaceBackup
}
