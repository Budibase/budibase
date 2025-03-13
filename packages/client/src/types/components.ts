import { Readable } from "svelte/store"

export type Component = Readable<{
  id: string
  name: string
  styles: any
  editing: boolean
  errorState: boolean
}>
