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
      span.addTags({ db_name: this.name, doc_id: docId })
      if (docId) {
        return this.db.exists(docId)
      }
      return this.db.exists()
    })
  }

  get<T extends Document>(id?: string | undefined): Promise<T> {
    return tracer.trace("db.get", span => {
      span.addTags({ db_name: this.name, doc_id: id })
      return this.db.get(id)
    })
  }

  tryGet<T extends Document>(id?: string | undefined): Promise<T | undefined> {
    return tracer.trace("db.tryGet", async span => {
      span.addTags({ db_name: this.name, doc_id: id })
      const doc = await this.db.tryGet<T>(id)
      span.addTags({ doc_found: doc !== undefined })
      return doc
    })
  }

  getMultiple<T extends Document>(
    ids: string[],
    opts?: { allowMissing?: boolean | undefined } | undefined
  ): Promise<T[]> {
    return tracer.trace("db.getMultiple", async span => {
      span.addTags({
        db_name: this.name,
        num_docs: ids.length,
        allow_missing: opts?.allowMissing,
      })
      const docs = await this.db.getMultiple<T>(ids, opts)
      span.addTags({ num_docs_found: docs.length })
      return docs
    })
  }

  remove(idOrDoc: Document): Promise<DocumentDestroyResponse>
  remove(idOrDoc: string, rev?: string): Promise<DocumentDestroyResponse>
  remove(
    idOrDoc: string | Document,
    rev?: string
  ): Promise<DocumentDestroyResponse> {
    return tracer.trace("db.remove", async span => {
      span.addTags({ db_name: this.name, doc_id: idOrDoc, rev })
      const isDocument = typeof idOrDoc === "object"
      const id = isDocument ? idOrDoc._id! : idOrDoc
      rev = isDocument ? idOrDoc._rev : rev
      const resp = await this.db.remove(id, rev)
      span.addTags({ ok: resp.ok })
      return resp
    })
  }

  bulkRemove(
    documents: Document[],
    opts?: { silenceErrors?: boolean }
  ): Promise<void> {
    return tracer.trace("db.bulkRemove", span => {
      span.addTags({
        db_name: this.name,
        num_docs: documents.length,
        silence_errors: opts?.silenceErrors,
      })
      return this.db.bulkRemove(documents, opts)
    })
  }

  put(
    document: AnyDocument,
    opts?: DatabasePutOpts | undefined
  ): Promise<DocumentInsertResponse> {
    return tracer.trace("db.put", async span => {
      span.addTags({
        db_name: this.name,
        doc_id: document._id,
        force: opts?.force,
      })
      const resp = await this.db.put(document, opts)
      span.addTags({ ok: resp.ok })
      return resp
    })
  }

  bulkDocs(documents: AnyDocument[]): Promise<DocumentBulkResponse[]> {
    return tracer.trace("db.bulkDocs", span => {
      span.addTags({ db_name: this.name, num_docs: documents.length })
      return this.db.bulkDocs(documents)
    })
  }

  allDocs<T extends Document | RowValue>(
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return tracer.trace("db.allDocs", async span => {
      span.addTags({ db_name: this.name, ...params })
      const resp = await this.db.allDocs<T>(params)
      span.addTags({
        total_rows: resp.total_rows,
        rows_length: resp.rows.length,
        offset: resp.offset,
      })
      return resp
    })
  }

  query<T extends Document>(
    viewName: string,
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return tracer.trace("db.query", async span => {
      span.addTags({ db_name: this.name, view_name: viewName, ...params })
      const resp = await this.db.query<T>(viewName, params)
      span.addTags({
        total_rows: resp.total_rows,
        rows_length: resp.rows.length,
        offset: resp.offset,
      })
      return resp
    })
  }

  destroy(): Promise<OkResponse> {
    return tracer.trace("db.destroy", async span => {
      span.addTags({ db_name: this.name })
      const resp = await this.db.destroy()
      span.addTags({ ok: resp.ok })
      return resp
    })
  }

  compact(): Promise<OkResponse> {
    return tracer.trace("db.compact", async span => {
      span.addTags({ db_name: this.name })
      const resp = await this.db.compact()
      span.addTags({ ok: resp.ok })
      return resp
    })
  }

  dump(stream: Writable, opts?: DatabaseDumpOpts | undefined): Promise<any> {
    return tracer.trace("db.dump", span => {
      span.addTags({
        db_name: this.name,
        batch_limit: opts?.batch_limit,
        batch_size: opts?.batch_size,
        style: opts?.style,
        timeout: opts?.timeout,
        num_doc_ids: opts?.doc_ids?.length,
        view: opts?.view,
      })
      return this.db.dump(stream, opts)
    })
  }

  load(...args: any[]): Promise<any> {
    return tracer.trace("db.load", span => {
      span.addTags({ db_name: this.name, num_args: args.length })
      return this.db.load(...args)
    })
  }

  createIndex(...args: any[]): Promise<any> {
    return tracer.trace("db.createIndex", span => {
      span.addTags({ db_name: this.name, num_args: args.length })
      return this.db.createIndex(...args)
    })
  }

  deleteIndex(...args: any[]): Promise<any> {
    return tracer.trace("db.deleteIndex", span => {
      span.addTags({ db_name: this.name, num_args: args.length })
      return this.db.deleteIndex(...args)
    })
  }

  getIndexes(...args: any[]): Promise<any> {
    return tracer.trace("db.getIndexes", span => {
      span.addTags({ db_name: this.name, num_args: args.length })
      return this.db.getIndexes(...args)
    })
  }

  sql<T extends Document>(
    sql: string,
    parameters?: SqlQueryBinding
  ): Promise<T[]> {
    return tracer.trace("db.sql", async span => {
      span.addTags({ db_name: this.name, num_bindings: parameters?.length })
      const resp = await this.db.sql<T>(sql, parameters)
      span.addTags({ num_rows: resp.length })
      return resp
    })
  }

  sqlPurgeDocument(docIds: string[] | string): Promise<void> {
    return tracer.trace("db.sqlPurgeDocument", span => {
      span.addTags({
        db_name: this.name,
        num_docs: Array.isArray(docIds) ? docIds.length : 1,
      })
      return this.db.sqlPurgeDocument(docIds)
    })
  }

  sqlDiskCleanup(): Promise<void> {
    return tracer.trace("db.sqlDiskCleanup", span => {
      span.addTags({ db_name: this.name })
      return this.db.sqlDiskCleanup()
    })
  }
}
