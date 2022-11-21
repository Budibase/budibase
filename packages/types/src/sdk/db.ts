import PouchDB from "pouchdb"
import Nano from "nano"
import { AllDocsResponse, AnyDocument } from "../"

export type PouchOptions = {
  inMemory?: boolean
  replication?: boolean
  onDisk?: boolean
  find?: boolean
}

export enum SortOption {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

export type CouchFindOptions = {
  selector: PouchDB.Find.Selector
  fields?: string[]
  sort?: {
    [key: string]: SortOption
  }[]
  limit?: number
  skip?: number
  bookmark?: string
}

export type DatabaseOpts = {
  skip_setup?: boolean
}

export type DatabasePutOpts = {
  force?: boolean
}

export type DatabaseQueryOpts = {
  include_docs?: boolean
  startkey?: string
  endkey?: string
  limit?: number
  skip?: number
  descending?: boolean
  key?: string
  keys?: string[]
}

export interface Database {
  name: string

  exists(): Promise<boolean>
  checkSetup(): Promise<Nano.DocumentScope<any>>
  get<T>(id?: string): Promise<T | any>
  remove(id: string, rev: string): Promise<Nano.DocumentDestroyResponse>
  put(
    document: AnyDocument,
    opts?: DatabasePutOpts
  ): Promise<Nano.DocumentInsertResponse>
  bulkDocs(documents: AnyDocument[]): Promise<Nano.DocumentBulkResponse[]>
  allDocs<T>(params: DatabaseQueryOpts): Promise<AllDocsResponse<T>>
  query<T>(
    viewName: string,
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>>
  destroy(): Promise<Nano.OkResponse | void>
  compact(): Promise<Nano.OkResponse | void>
  // these are all PouchDB related functions that are rarely used - in future
  // should be replaced by better typed/non-pouch implemented methods
  dump(...args: any[]): Promise<any>
  load(...args: any[]): Promise<any>
  createIndex(...args: any[]): Promise<any>
  deleteIndex(...args: any[]): Promise<any>
  getIndexes(...args: any[]): Promise<any>
}
