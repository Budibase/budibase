import { APIClient } from "@budibase/frontend-core"
import type { ActionTypes } from "./constants"
import { Readable, Writable } from "svelte/store"

export interface SDK {
  API: APIClient
  styleable: any
  Provider: any
  ActionTypes: typeof ActionTypes
  fetchDatasourceSchema: any
  generateGoldenSample: any
  builderStore: Readable<{
    inBuilder: boolean
  }>
}

export type Component = Writable<{
  id: string
  styles: any
  errorState: string
}>

export type Context = Readable<any>
