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

export interface UIBinding {
  type: UIBindingContext
  tableId?: string
  fieldSchema?: {
    name: string
    tableId: string
    type: string
    subtype?: string
    prefixKeys?: string
  }
  component?: string
  providerId?: string
  readableBinding?: string
  runtimeBinding?: string
  icon?: string
  category?: string
}

export type UIBindingContext = "context" | "action"

export type UIActionType = ""
