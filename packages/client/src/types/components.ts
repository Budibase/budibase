import { Readable } from "svelte/store"

export type Component = Readable<{
  id: string
  type: string
  name: string
  styles: any
  editing: boolean
  errorState: boolean
  path: string[]
}>
