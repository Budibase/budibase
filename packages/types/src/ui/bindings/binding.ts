export interface BindingCompletion {
  section: {
    name: string
  }
  label: string
}

export interface EnrichedBinding {
  runtimeBinding: string
  readableBinding: string
  type?: null | string
}

export enum BindingMode {
  Text = "Text",
  JavaScript = "JavaScript",
}

export type CaretPositionFn = () => { start: number; end: number }

export type InsertAtPositionFn = (_: {
  start: number
  end?: number
  value: string
  cursor?: { anchor: number }
}) => void
