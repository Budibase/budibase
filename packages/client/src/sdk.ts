import { APIClient } from "@budibase/frontend-core"
import type { ActionTypes } from "./constants"

export interface SDK {
  API: APIClient
  styleable: unknown
  Provider: unknown
  ActionTypes: typeof ActionTypes
}
