export interface ProcessOptions {
  cacheTemplates?: boolean
  noEscaping?: boolean
  noHelpers?: boolean
  noFinalise?: boolean
  noThrow?: boolean
  escapeNewlines?: boolean
  onlyFound?: boolean
  disabledHelpers?: string[]
}

export interface Log {
  log: string
  line?: number
}
