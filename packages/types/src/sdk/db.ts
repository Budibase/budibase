import PouchDB from "pouchdb"

export type PouchOptions = {
  inMemory: boolean
  replication: boolean
  onDisk: boolean
  find: boolean
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
