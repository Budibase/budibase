import { Document } from "../document"

export enum WebSearchProvider {
  EXA = "exa",
  PARALLEL = "parallel",
}

export interface WebSearchConfig extends Document {
  provider: WebSearchProvider
  apiKey: string
}
