export interface ProcessOptions {
  cacheTemplates?: boolean
  noEscaping?: boolean
  noHelpers?: boolean
  noFinalise?: boolean
  noThrow?: boolean
  escapeNewlines?: boolean
  onlyFound?: boolean
  disabledHelpers?: string[]
  serializeArrays?: boolean
}

export type LogType = "log" | "info" | "debug" | "warn" | "error" | "table"

export interface Log {
  log: any[]
  line?: number
  type?: LogType
}
