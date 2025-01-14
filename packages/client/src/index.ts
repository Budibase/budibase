import { APIClient } from "@budibase/frontend-core"
import type { ActionTypes } from "./constants"
import { Readable } from "svelte/store"

export interface SDK {
  API: APIClient
  styleable: any
  Provider: any
  ActionTypes: typeof ActionTypes
}

export type Component = Readable<{
  id: string
  styles: any
}>
