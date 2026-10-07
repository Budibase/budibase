export type ArrayHandling = "stringify" | "preserve"

export interface ProcessOptions {
  cacheTemplates?: boolean
  noEscaping?: boolean
  noHelpers?: boolean
  noFinalise?: boolean
  noThrow?: boolean
  escapeNewlines?: boolean
  onlyFound?: boolean
  disabledHelpers?: string[]
  arrayHandling?: ArrayHandling
}

export type LogType = "log" | "info" | "debug" | "warn" | "error" | "table"

export interface Log {
  log: any[]
  line?: number
  type?: LogType
}
