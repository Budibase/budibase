const toArray = (value?: unknown): string[] => {
  return Array.isArray(value) ? [...value] : []
}

const hasOptions = (options?: string[]): boolean => {
  return Array.isArray(options) && options.length > 0
}

const filterValidOptions = (values: string[], options?: string[]): string[] => {
  if (!Array.isArray(values)) {
    return []
  }
  if (!hasOptions(options)) {
    return [...values]
  }
  return values.filter(value => options.includes(value))
}

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return false
  }
  return a.every((value, index) => value === b[index])
}

export class MultiFieldSelectionState {
  private selection: string[] = []
  private lastPropValue: string[] = []

  constructor(initialValue?: unknown, options?: string[]) {
    const normalized = toArray(initialValue)
    this.lastPropValue = normalized
    this.selection = hasOptions(options)
      ? filterValidOptions(normalized, options)
      : normalized
  }

  syncFromProps(value?: unknown, options?: string[]) {
    const normalized = toArray(value)
    if (!arraysEqual(normalized, this.lastPropValue)) {
      this.lastPropValue = normalized
      this.selection = hasOptions(options)
        ? filterValidOptions(normalized, options)
        : normalized
    }
    this.applyOptionFilter(options)
  }

  applyUserSelection(value: unknown, options?: string[]) {
    const normalized = filterValidOptions(toArray(value), options)
    this.selection = normalized
    this.lastPropValue = normalized
  }

  getSelection() {
    return this.selection
  }

  private applyOptionFilter(options?: string[]) {
    if (!hasOptions(options)) {
      return
    }
    const filtered = filterValidOptions(this.selection, options)
    if (!arraysEqual(filtered, this.selection)) {
      this.selection = filtered
    }
  }
}
