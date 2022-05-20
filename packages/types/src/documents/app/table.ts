import { Document } from "../document"
import { View } from "./view"

export interface Table extends Document {
  views: { [key: string]: View }
}
