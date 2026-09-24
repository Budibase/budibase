import { Document, DocumentType } from "@budibase/types"
import PouchDB from "pouchdb"
import { DesignDocuments, SEPARATOR } from "../constants"
import { closePouchDB, getPouchDB } from "./couch"
import { directCouchCall } from "./couch/utils"
import { tracer } from "dd-trace"

const _PouchDB = PouchDB // Keep Prettier from removing import

const DEFAULT_REPLICATION_BATCH_SIZE = 1000
const TOMBSTONE_CHANGES_BATCH_SIZE = 500
const TOMBSTONE_LOOKUP_BATCH_SIZE = 200

enum ReplicationDirection {
  TO_PRODUCTION = "toProduction",
  TO_DEV = "toDev",
}

type DocumentWithID = Omit<Document, "_id"> & { _id: string }
type ChangeSequence = number | string

interface TombstoneCheckpoint extends PouchDB.Core.IdMeta {
  lastSequence: ChangeSequence
  _rev?: PouchDB.Core.RevisionId
}

type AppReplicationOptions = PouchDB.Replication.ReplicateOptions & {
  isCreation?: boolean
  tablesToSync?: string[] | "all"
  tombstoneIds?: string[]
  tombstonesOnly?: boolean
}

interface TombstoneRevision {
  id: string
  rev: string
}

interface CouchPurgeResponse {
  purged?: Record<string, string[]>
}

const TOMBSTONE_CHECKPOINT_ID = "_local/budibase-publish-tombstones"

function isDataDocumentId(id: string) {
  return (
    id.startsWith(DocumentType.ROW + SEPARATOR) ||
    id.startsWith(DocumentType.LINK + SEPARATOR)
  )
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 404
  )
}

class Replication {
  source: PouchDB.Database
  target: PouchDB.Database
  sourceName: string
  targetName: string
  direction: ReplicationDirection | undefined

  constructor({ source, target }: { source: string; target: string }) {
    this.sourceName = source
    this.targetName = target
    this.source = getPouchDB(source)
    this.target = getPouchDB(target)
    if (
      source.startsWith(DocumentType.WORKSPACE_DEV) &&
      target.startsWith(DocumentType.WORKSPACE)
    ) {
      this.direction = ReplicationDirection.TO_PRODUCTION
    } else if (
      source.startsWith(DocumentType.WORKSPACE) &&
      target.startsWith(DocumentType.WORKSPACE_DEV)
    ) {
      this.direction = ReplicationDirection.TO_DEV
    }
  }

  async close() {
    await Promise.all([closePouchDB(this.source), closePouchDB(this.target)])
  }

  replicate(opts: PouchDB.Replication.ReplicateOptions = {}) {
    return tracer.trace("db.replicate", async span => {
      span?.addTags({
        source: this.source.name,
        target: this.target.name,
        batch_size: opts.batch_size,
        batches_limit: opts.batches_limit,
        checkpoint: opts.checkpoint,
      })
      return new Promise<PouchDB.Replication.ReplicationResult<{}>>(
        (resolve, reject) => {
          this.source.replicate
            .to(this.target, opts)
            .on("denied", function (err) {
              // a document failed to replicate (e.g. due to permissions)
              reject(new Error(`Denied: Document failed to replicate ${err}`))
            })
            .on("complete", function (info) {
              span?.addTags({
                docs_read: info.docs_read,
                docs_written: info.docs_written,
                doc_write_failures: info.doc_write_failures,
              })
              return resolve(info)
            })
            .on("error", function (err) {
              reject(err)
            })
        }
      )
    })
  }

  async replicateApp(opts: AppReplicationOptions = {}) {
    if (this.direction !== ReplicationDirection.TO_PRODUCTION) {
      return this.replicate(this.appReplicateOpts(opts))
    }

    if (typeof opts.filter === "string") {
      throw new Error(
        "Named CouchDB filters cannot be used when replicating to production"
      )
    }
    const canAdvanceTombstoneCheckpoint =
      opts.checkpoint !== false &&
      !opts.filter &&
      !opts.selector &&
      (opts.tablesToSync === undefined || opts.tablesToSync === "all")

    const checkpoint = await this.getTombstoneCheckpoint()
    let since = checkpoint
    let lastSequence = checkpoint
    let tombstoneWritesSucceeded = true
    const tombstonesToClean = new Map<string, TombstoneRevision>()
    const sourceTombstonesToClean = new Map<string, TombstoneRevision>()

    while (true) {
      const changes = await this.source.changes<Document>({
        since,
        limit: TOMBSTONE_CHANGES_BATCH_SIZE,
        include_docs: true,
        style: "all_docs",
      })
      lastSequence = changes.last_seq
      const batchDeletedIds = changes.results
        .filter(change => change.deleted)
        .map(change => change.id)
      const tombstoneFilter = this.appReplicateOpts({
        ...opts,
        tombstoneIds: batchDeletedIds,
      }).filter as (doc: DocumentWithID, params: object) => boolean
      const deletedIds = Array.from(
        new Set(
          changes.results
            .filter(change => change.deleted)
            .filter(change => {
              const revs = change.changes?.map(({ rev }) => rev) ?? []
              if (revs.length !== 1) {
                return false
              }
              const doc = {
                ...(change.doc as DocumentWithID | undefined),
                _id: change.id,
                _rev: revs[0],
                _deleted: true,
              }
              return tombstoneFilter(doc, {})
            })
            .map(change => change.id)
        )
      )

      for (const change of changes.results) {
        if (!change.deleted) {
          continue
        }
        const rev = change.changes?.[0]?.rev
        if (!rev) {
          continue
        }
        if (deletedIds.includes(change.id)) {
          tombstonesToClean.set(change.id, { id: change.id, rev })
        } else if (
          canAdvanceTombstoneCheckpoint &&
          isDataDocumentId(change.id)
        ) {
          sourceTombstonesToClean.set(change.id, { id: change.id, rev })
        }
      }

      for (
        let offset = 0;
        offset < deletedIds.length;
        offset += TOMBSTONE_LOOKUP_BATCH_SIZE
      ) {
        const ids = deletedIds.slice(
          offset,
          offset + TOMBSTONE_LOOKUP_BATCH_SIZE
        )
        const targetDocs = await this.target.allDocs({ keys: ids })
        const tombstoneIds = targetDocs.rows.flatMap(row => {
          if ("error" in row || row.value.deleted) {
            return []
          }
          return [row.id]
        })
        if (!tombstoneIds.length) {
          continue
        }

        const result = await this.replicate(
          this.appReplicateOpts({
            ...opts,
            checkpoint: false,
            tombstoneIds,
            tombstonesOnly: true,
          })
        )
        if (result.doc_write_failures > 0) {
          tombstoneWritesSucceeded = false
        }
      }

      if (
        changes.results.length < TOMBSTONE_CHANGES_BATCH_SIZE ||
        changes.last_seq === since
      ) {
        break
      }
      since = changes.last_seq
    }

    const result = await this.replicate(
      this.appReplicateOpts({ ...opts, tombstoneIds: [] })
    )
    if (result.doc_write_failures > 0) {
      tombstoneWritesSucceeded = false
    }
    if (tombstoneWritesSucceeded) {
      for (const tombstone of tombstonesToClean.values()) {
        try {
          if (!(await this.cleanReplicatedTombstone(tombstone))) {
            tombstoneWritesSucceeded = false
          }
        } catch (error) {
          // Tombstone cleanup is best-effort; leave the source revision so a later publish can retry.
          console.warn(
            "Unable to purge published tombstone",
            tombstone.id,
            error
          )
          tombstoneWritesSucceeded = false
        }
      }
      for (const tombstone of sourceTombstonesToClean.values()) {
        try {
          if (!(await this.cleanSourceTombstone(tombstone))) {
            tombstoneWritesSucceeded = false
          }
        } catch (error) {
          console.warn(
            "Unable to purge excluded tombstone",
            tombstone.id,
            error
          )
          tombstoneWritesSucceeded = false
        }
      }
    }
    if (tombstoneWritesSucceeded && canAdvanceTombstoneCheckpoint) {
      await this.saveTombstoneCheckpoint(lastSequence)
    }
    return result
  }

  private async cleanReplicatedTombstone({
    id,
    rev,
  }: TombstoneRevision): Promise<boolean> {
    const [sourceChanges, targetChanges] = await Promise.all([
      this.source.changes<Document>({
        since: 0,
        doc_ids: [id],
        include_docs: true,
        style: "all_docs",
      }),
      this.target.changes<Document>({
        since: 0,
        doc_ids: [id],
        include_docs: true,
        style: "all_docs",
      }),
    ])
    const latestChange = (results: typeof sourceChanges.results) =>
      [...results].reverse().find(change => change.id === id)
    const sourceChange = latestChange(sourceChanges.results)
    const targetChange = latestChange(targetChanges.results)
    const hasOnlyTombstoneRevision = (change: typeof sourceChange) =>
      !!change?.deleted &&
      change.changes?.length === 1 &&
      change.changes[0].rev === rev

    if (!hasOnlyTombstoneRevision(sourceChange)) {
      return false
    }
    if (targetChange && !hasOnlyTombstoneRevision(targetChange)) {
      return false
    }

    if (targetChange) {
      if (!(await this.purgeRevision(this.targetName, id, rev))) {
        return false
      }
    }
    return await this.purgeRevision(this.sourceName, id, rev)
  }

  private async cleanSourceTombstone({
    id,
    rev,
  }: TombstoneRevision): Promise<boolean> {
    const sourceChanges = await this.source.changes<Document>({
      since: 0,
      doc_ids: [id],
      include_docs: true,
      style: "all_docs",
    })
    const sourceChange = [...sourceChanges.results]
      .reverse()
      .find(change => change.id === id)
    const hasOnlyTombstoneRevision =
      !!sourceChange?.deleted &&
      sourceChange.changes?.length === 1 &&
      sourceChange.changes[0].rev === rev

    if (!hasOnlyTombstoneRevision) {
      return false
    }
    return await this.purgeRevision(this.sourceName, id, rev)
  }

  private async purgeRevision(dbName: string, id: string, rev: string) {
    const response = await directCouchCall(`${dbName}/_purge`, "POST", {
      [id]: [rev],
    })
    if (!response.ok) {
      throw new Error(`CouchDB purge failed with status ${response.status}`)
    }
    const body: CouchPurgeResponse = await response.json()
    return body.purged?.[id]?.includes(rev) ?? false
  }

  private async getTombstoneCheckpoint(): Promise<ChangeSequence> {
    try {
      const checkpoint = await this.target.get<TombstoneCheckpoint>(
        TOMBSTONE_CHECKPOINT_ID
      )
      return checkpoint.lastSequence
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error
      }
    }
    return 0
  }

  private async saveTombstoneCheckpoint(lastSequence: ChangeSequence) {
    let checkpoint: TombstoneCheckpoint = {
      _id: TOMBSTONE_CHECKPOINT_ID,
      lastSequence,
    }
    try {
      const existing = await this.target.get<TombstoneCheckpoint>(
        TOMBSTONE_CHECKPOINT_ID
      )
      checkpoint = { ...checkpoint, _rev: existing._rev }
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error
      }
    }

    await this.target.put(checkpoint)
  }

  // If the target rev went ahead the source rev, replication will cause conflicts and the document will not update in the target.
  // This function checks the delta, and updates the source document rev to be ahead of the target, allowing the document to be copied
  async resolveInconsistencies(documentIds: string[]) {
    for (const documentId of documentIds) {
      try {
        const [sourceDocument, targetDocument] = await Promise.all([
          this.source.get(documentId),
          this.target.get(documentId),
        ])

        const delta = this.replicationDelta(sourceDocument, targetDocument)
        if (delta < 0) {
          // The source document is ahead of the target, there will be no conflicts
          continue
        }

        if (delta === 0) {
          if (sourceDocument._rev === targetDocument._rev) {
            // The document is at the same version
            continue
          }
          // They have the same count, but different version.
          //  Both documents have been updated the same number of times, but they differ, so they need to be sync
        }

        const versionsToJump = delta + 1 // We always need the source to be one version ahead

        await tracer.trace("Replication.resolveInconsistencies", async span => {
          span.addTags({
            versionsToJump,
            toFix: true,
            id: documentId,
            sourceRev: sourceDocument._rev,
            targetRev: targetDocument._rev,
          })
          for (let i = 0; i < versionsToJump; i++) {
            const doc = await this.source.get(targetDocument._id)
            await this.source.put(doc)
          }
        })
      } catch (error) {
        console.warn("Cannot resolve inconsistencies for document", documentId)
      }
    }
  }

  private replicationDelta(sourceDocument: Document, targetDocument: Document) {
    const sourceRevisionNumber = this.getRevisionNumber(sourceDocument)
    const targetRevisionNumber = this.getRevisionNumber(targetDocument)
    const delta = targetRevisionNumber - sourceRevisionNumber
    return delta
  }

  private getRevisionNumber(document: Document) {
    return parseInt(document._rev?.split("-")[0] || "0")
  }

  appReplicateOpts(
    opts: AppReplicationOptions = {}
  ): PouchDB.Replication.ReplicateOptions {
    const direction = this.direction
    const tombstoneIds = new Set<string>(opts.tombstoneIds ?? [])
    delete opts.tombstoneIds
    const tombstonesOnly = opts.tombstonesOnly
    delete opts.tombstonesOnly
    if (typeof opts.filter === "string") {
      if (direction === ReplicationDirection.TO_PRODUCTION) {
        throw new Error(
          "Named CouchDB filters cannot be used when replicating to production"
        )
      }
      opts.batch_size = opts.batch_size ?? DEFAULT_REPLICATION_BATCH_SIZE
      return opts
    }

    const filter = opts.filter
    const toDev = direction === ReplicationDirection.TO_DEV
    delete opts.filter

    const isCreation = opts.isCreation
    let tablesToSync = opts.tablesToSync
    delete opts.isCreation
    delete opts.tablesToSync

    let syncAllTables = false,
      tableSyncList: string[] | undefined
    if (typeof tablesToSync === "string" && tablesToSync === "all") {
      syncAllTables = true
    } else if (tablesToSync) {
      tableSyncList = tablesToSync
    }

    const startsWithID = (_id: string, documentType: string) => {
      return _id?.startsWith(documentType + SEPARATOR)
    }

    const isData = (_id: string) =>
      startsWithID(_id, DocumentType.ROW) ||
      startsWithID(_id, DocumentType.LINK)

    const result: PouchDB.Replication.ReplicateOptions = {
      ...opts,
      batch_size: opts.batch_size ?? DEFAULT_REPLICATION_BATCH_SIZE,
      filter: (doc: DocumentWithID, params: any) => {
        if (tombstonesOnly && !doc._deleted) {
          return false
        }
        if (!isCreation && doc._id === DesignDocuments.MIGRATIONS) {
          return false
        }
        // don't sync design documents
        if (toDev && doc._id.startsWith("_design")) {
          return false
        }
        if (startsWithID(doc._id, DocumentType.SLACK_APP_CONFIG)) {
          return false
        }
        if (
          direction === ReplicationDirection.TO_PRODUCTION &&
          !isCreation &&
          startsWithID(doc._id, DocumentType.AUTO_COLUMN_STATE)
        ) {
          return false
        }
        if (isData(doc._id)) {
          const isInSelectedTable =
            !!tableSyncList?.find(id => doc._id.includes(id)) || syncAllTables
          if (tableSyncList || syncAllTables) {
            return isInSelectedTable && (!filter || filter(doc, params))
          }
          return !!filter?.(doc, params)
        }
        if (startsWithID(doc._id, DocumentType.AUTOMATION_LOG)) {
          return false
        }
        if (startsWithID(doc._id, DocumentType.AGENT_LOG_SESSION)) {
          return false
        }
        if (doc._id === DocumentType.WORKSPACE_METADATA) {
          return false
        }
        if (doc._deleted) {
          if (direction !== ReplicationDirection.TO_PRODUCTION) {
            return true
          }
          return tombstoneIds.has(doc._id) && (!filter || filter(doc, params))
        }
        return filter ? filter(doc, params) : true
      },
    }

    if (!filter || direction === ReplicationDirection.TO_PRODUCTION) {
      const generatedSelector = this.buildReplicationSelector({
        direction,
        isCreation,
        tableSyncList,
        syncAllTables,
        tombstoneIds: Array.from(tombstoneIds),
        tombstonesOnly: tombstonesOnly ?? false,
        hasCustomFilter: !!filter,
      })
      result.selector = opts.selector
        ? { $and: [opts.selector, generatedSelector] }
        : generatedSelector
    }

    return result
  }

  private buildReplicationSelector(opts: {
    direction: ReplicationDirection | undefined
    isCreation?: boolean
    tableSyncList?: string[]
    syncAllTables: boolean
    tombstoneIds: string[]
    tombstonesOnly: boolean
    hasCustomFilter: boolean
  }): PouchDB.Find.Selector {
    const {
      direction,
      isCreation,
      tableSyncList,
      syncAllTables,
      tombstoneIds,
      tombstonesOnly,
      hasCustomFilter,
    } = opts
    const toDev = direction === ReplicationDirection.TO_DEV
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const startsWith = (prefix: string): PouchDB.Find.Selector => ({
      _id: { $regex: `^${escapeRegExp(prefix)}` },
    })
    const not = (selector: PouchDB.Find.Selector): PouchDB.Find.Selector => ({
      $nor: [selector],
    })

    const unconditional: PouchDB.Find.Selector[] = [
      not(startsWith(DocumentType.SLACK_APP_CONFIG + SEPARATOR)),
    ]
    if (!isCreation) {
      unconditional.push(not({ _id: DesignDocuments.MIGRATIONS }))
    }
    if (toDev) {
      unconditional.push(not(startsWith("_design")))
    }

    const fallback: PouchDB.Find.Selector[] = [
      not(startsWith(DocumentType.AUTOMATION_LOG + SEPARATOR)),
      not(startsWith(DocumentType.AGENT_LOG_SESSION + SEPARATOR)),
      not({ _id: DocumentType.WORKSPACE_METADATA }),
    ]
    if (direction === ReplicationDirection.TO_PRODUCTION && !isCreation) {
      fallback.push(not(startsWith(DocumentType.AUTO_COLUMN_STATE + SEPARATOR)))
    }
    let dataScope: PouchDB.Find.Selector | undefined
    if (!syncAllTables) {
      const isNotData = not({
        $or: [
          startsWith(DocumentType.ROW + SEPARATOR),
          startsWith(DocumentType.LINK + SEPARATOR),
        ],
      })
      dataScope = tableSyncList?.length
        ? {
            $or: [
              isNotData,
              {
                $or: tableSyncList.map(id => ({
                  _id: { $regex: escapeRegExp(id) },
                })),
              },
            ],
          }
        : isNotData
    }
    const replicationFallback = dataScope ? [...fallback, dataScope] : fallback
    const tombstoneFallback =
      hasCustomFilter && !tableSyncList ? fallback : replicationFallback

    let documents: PouchDB.Find.Selector
    if (direction === ReplicationDirection.TO_PRODUCTION) {
      const liveDocuments = {
        $and: [...replicationFallback],
      }
      const allowedTombstones = tombstoneIds.length
        ? {
            $and: [{ _id: { $in: tombstoneIds } }, ...tombstoneFallback],
          }
        : undefined
      if (tombstonesOnly) {
        documents = allowedTombstones ?? { _id: { $in: [] } }
      } else {
        documents = allowedTombstones
          ? { $or: [liveDocuments, allowedTombstones] }
          : liveDocuments
      }
    } else {
      documents = { $or: [{ _deleted: true }, { $and: fallback }] }
    }

    return { $and: [...unconditional, documents] }
  }

  /**
   * Rollback the target DB back to the state of the source DB
   */
  async rollback() {
    await this.target.destroy()
    // Recreate the DB again
    this.target = getPouchDB(this.target.name)
    // take the opportunity to remove deleted tombstones
    await this.replicate()
  }
}

export default Replication
