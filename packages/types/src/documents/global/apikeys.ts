import { Document } from "../../"

export interface ApiKeyDoc extends Document {
  apiKeys: Record<string, string>
}
