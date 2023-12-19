import {
  DocumentScope,
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
} from "@budibase/types"
import tracer from "dd-trace"
import { Writable } from "stream"

export class DDInstrumentedDatabase implements Database {
  constructor(
    private readonly db: Database,
    private readonly resource: string
  ) {}

  get name(): string {
    return this.db.name
  }

  exists(): Promise<boolean> {
    return tracer.trace("exists", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.exists()
    })
  }

  checkSetup(): Promise<DocumentScope<any>> {
    return tracer.trace("checkSetup", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.checkSetup()
    })
  }

  get<T extends Document>(id?: string | undefined): Promise<T> {
    return tracer.trace("get", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name, doc_id: id })
      return this.db.get(id)
    })
  }

  getMultiple<T extends Document>(
    ids: string[],
    opts?: { allowMissing?: boolean | undefined } | undefined
  ): Promise<T[]> {
    return tracer.trace("getMultiple", { resource: this.resource }, span => {
      span?.addTags({
        db_name: this.name,
        num_docs: ids.length,
        allow_missing: opts?.allowMissing,
      })
      return this.db.getMultiple(ids, opts)
    })
  }

  remove(
    id: string | Document,
    rev?: string | undefined
  ): Promise<DocumentDestroyResponse> {
    return tracer.trace("remove", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name, doc_id: id })
      return this.db.remove(id, rev)
    })
  }

  put(
    document: AnyDocument,
    opts?: DatabasePutOpts | undefined
  ): Promise<DocumentInsertResponse> {
    return tracer.trace("put", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name, doc_id: document._id })
      return this.db.put(document, opts)
    })
  }

  bulkDocs(documents: AnyDocument[]): Promise<DocumentBulkResponse[]> {
    return tracer.trace("bulkDocs", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name, num_docs: documents.length })
      return this.db.bulkDocs(documents)
    })
  }

  allDocs<T extends Document>(
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return tracer.trace("allDocs", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.allDocs(params)
    })
  }

  query<T extends Document>(
    viewName: string,
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return tracer.trace("query", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name, view_name: viewName })
      return this.db.query(viewName, params)
    })
  }

  destroy(): Promise<void | OkResponse> {
    return tracer.trace("destroy", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.destroy()
    })
  }

  compact(): Promise<void | OkResponse> {
    return tracer.trace("compact", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.compact()
    })
  }

  dump(stream: Writable, opts?: DatabaseDumpOpts | undefined): Promise<any> {
    return tracer.trace("dump", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.dump(stream, opts)
    })
  }

  load(...args: any[]): Promise<any> {
    return tracer.trace("load", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.load(...args)
    })
  }

  createIndex(...args: any[]): Promise<any> {
    return tracer.trace("createIndex", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.createIndex(...args)
    })
  }

  deleteIndex(...args: any[]): Promise<any> {
    return tracer.trace("deleteIndex", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.deleteIndex(...args)
    })
  }

  getIndexes(...args: any[]): Promise<any> {
    return tracer.trace("getIndexes", { resource: this.resource }, span => {
      span?.addTags({ db_name: this.name })
      return this.db.getIndexes(...args)
    })
  }
}
