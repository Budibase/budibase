import { Document } from "../document"
import { SourceNames } from "../../sdk"
import { Table } from "./table"

export interface Datasource extends Document {
  type: string
  name?: string
  source: SourceNames
  // the config is defined by the schema
  config?: {
    [key: string]: string | number | boolean
  }
  plus?: boolean
  entities?: {
    [key: string]: Table
  }
}
