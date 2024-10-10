import {
  DocumentDestroyResponse,
  DocumentInsertResponse,
  DocumentBulkResponse,
  OkResponse,
} from "@budibase/nano"
import {
  AllDocsResponse,
  AnyDocument,
  Database,
  DatabaseDumpOpts,
  DatabasePutOpts,
  DatabaseQueryOpts,
  Document,
  RowValue,
  SqlQueryBinding,
} from "@budibase/types"
import tracer from "dd-trace"
import { Writable } from "stream"

export class DDInstrumentedDatabase implements Database {
  constructor(private readonly db: Database) {}

  get name(): string {
    return this.db.name
  }

  exists(docId?: string): Promise<boolean> {
    return tracer.trace("db.exists", span => {
      span?.addTags({ db_name: this.name, doc_id: docId })
      if (docId) {
        return this.db.exists(docId)
      }
      return this.db.exists()
    })
  }

  get<T extends Document>(id?: string | undefined): Promise<T> {
    return tracer.trace("db.get", span => {
      span?.addTags({ db_name: this.name, doc_id: id })
      return this.db.get(id)
    })
  }

  tryGet<T extends Document>(id?: string | undefined): Promise<T | undefined> {
    return tracer.trace("db.tryGet", span => {
      span?.addTags({ db_name: this.name, doc_id: id })
      return this.db.tryGet(id)
    })
  }

  getMultiple<T extends Document>(
    ids: string[],
    opts?: { allowMissing?: boolean | undefined } | undefined
  ): Promise<T[]> {
    return tracer.trace("db.getMultiple", span => {
      span?.addTags({
        db_name: this.name,
        num_docs: ids.length,
        allow_missing: opts?.allowMissing,
      })
      return this.db.getMultiple(ids, opts)
    })
  }

  remove(idOrDoc: Document): Promise<DocumentDestroyResponse>
  remove(idOrDoc: string, rev?: string): Promise<DocumentDestroyResponse>
  remove(
    idOrDoc: string | Document,
    rev?: string
  ): Promise<DocumentDestroyResponse> {
    return tracer.trace("db.remove", span => {
      span?.addTags({ db_name: this.name, doc_id: idOrDoc })
      const isDocument = typeof idOrDoc === "object"
      const id = isDocument ? idOrDoc._id! : idOrDoc
      rev = isDocument ? idOrDoc._rev : rev
      return this.db.remove(id, rev)
    })
  }

  bulkRemove(
    documents: Document[],
    opts?: { silenceErrors?: boolean }
  ): Promise<void> {
    return tracer.trace("db.bulkRemove", span => {
      span?.addTags({ db_name: this.name, num_docs: documents.length })
      return this.db.bulkRemove(documents, opts)
    })
  }

  put(
    document: AnyDocument,
    opts?: DatabasePutOpts | undefined
  ): Promise<DocumentInsertResponse> {
    return tracer.trace("db.put", span => {
      span?.addTags({ db_name: this.name, doc_id: document._id })
      return this.db.put(document, opts)
    })
  }

  bulkDocs(documents: AnyDocument[]): Promise<DocumentBulkResponse[]> {
    return tracer.trace("db.bulkDocs", span => {
      span?.addTags({ db_name: this.name, num_docs: documents.length })
      return this.db.bulkDocs(documents)
    })
  }

  allDocs<T extends Document | RowValue>(
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return tracer.trace("db.allDocs", span => {
      span?.addTags({ db_name: this.name })
      return this.db.allDocs(params)
    })
  }

  query<T extends Document>(
    viewName: string,
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return tracer.trace("db.query", span => {
      span?.addTags({ db_name: this.name, view_name: viewName })
      return this.db.query(viewName, params)
    })
  }

  destroy(): Promise<void | OkResponse> {
    return tracer.trace("db.destroy", span => {
      span?.addTags({ db_name: this.name })
      return this.db.destroy()
    })
  }

  compact(): Promise<void | OkResponse> {
    return tracer.trace("db.compact", span => {
      span?.addTags({ db_name: this.name })
      return this.db.compact()
    })
  }

  dump(stream: Writable, opts?: DatabaseDumpOpts | undefined): Promise<any> {
    return tracer.trace("db.dump", span => {
      span?.addTags({ db_name: this.name })
      return this.db.dump(stream, opts)
    })
  }

  load(...args: any[]): Promise<any> {
    return tracer.trace("db.load", span => {
      span?.addTags({ db_name: this.name })
      return this.db.load(...args)
    })
  }

  createIndex(...args: any[]): Promise<any> {
    return tracer.trace("db.createIndex", span => {
      span?.addTags({ db_name: this.name })
      return this.db.createIndex(...args)
    })
  }

  deleteIndex(...args: any[]): Promise<any> {
    return tracer.trace("db.deleteIndex", span => {
      span?.addTags({ db_name: this.name })
      return this.db.deleteIndex(...args)
    })
  }

  getIndexes(...args: any[]): Promise<any> {
    return tracer.trace("db.getIndexes", span => {
      span?.addTags({ db_name: this.name })
      return this.db.getIndexes(...args)
    })
  }

  sql<T extends Document>(
    sql: string,
    parameters?: SqlQueryBinding
  ): Promise<T[]> {
    return tracer.trace("db.sql", span => {
      span?.addTags({ db_name: this.name })
      return this.db.sql(sql, parameters)
    })
  }

  sqlPurgeDocument(docIds: string[] | string): Promise<void> {
    return tracer.trace("db.sqlPurgeDocument", span => {
      span?.addTags({ db_name: this.name })
      return this.db.sqlPurgeDocument(docIds)
    })
  }

  sqlDiskCleanup(): Promise<void> {
    return tracer.trace("db.sqlDiskCleanup", span => {
      span?.addTags({ db_name: this.name })
      return this.db.sqlDiskCleanup()
    })
  }
}
