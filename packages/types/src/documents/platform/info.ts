import { Document } from "../document"

export interface GlobalInfo {}

export interface Installation extends Document {
  _id: string
  installId: string
  version: string
}
