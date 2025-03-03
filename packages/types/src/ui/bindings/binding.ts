export interface EnrichedBinding {
  value: string
  valueHTML: string
  runtimeBinding: string
  readableBinding: string
  type?: null | string
  icon?: string
  category: string
  display?: { name: string; type: string }
  fieldSchema?: {
    name: string
    tableId: string
    type: string
    subtype?: string
    prefixKeys?: string
  }
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
  tableId?: string
  fieldSchema?: {
    name: string
    tableId: string
    type: string
    subtype?: string
    prefixKeys?: string
  }
  component?: string
  providerId: string
  readableBinding?: string
  runtimeBinding?: string
}
