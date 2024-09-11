export interface ProcessOptions {
  cacheTemplates?: boolean
  noEscaping?: boolean
  noHelpers?: boolean
  noFinalise?: boolean
  escapeNewlines?: boolean
  onlyFound?: boolean
  disabledHelpers?: string[]
}
