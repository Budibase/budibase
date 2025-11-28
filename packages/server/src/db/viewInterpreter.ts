import { DBView, Document, Row, ViewFilter } from "@budibase/types"

type EmitFn = (key: any, value?: any) => void

const CONDITIONS = {
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  LT: "LT",
  LTE: "LTE",
  MT: "MT",
  MTE: "MTE",
  CONTAINS: "CONTAINS",
  EMPTY: "EMPTY",
  NOT_EMPTY: "NOT_EMPTY",
} as const

const CONJUNCTIONS = {
  AND: "AND",
  OR: "OR",
} as const

const isEmpty = (value: any) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0)

const evaluateComparator = (left: any, right: any, operator: string) => {
  switch (operator) {
    case CONDITIONS.EQUALS:
      return left === right
    case CONDITIONS.NOT_EQUALS:
      return left !== right
    case CONDITIONS.LT:
      return left < right
    case CONDITIONS.LTE:
      return left <= right
    case CONDITIONS.MT:
      return left > right
    case CONDITIONS.MTE:
      return left >= right
    case CONDITIONS.CONTAINS:
      if (typeof left === "string") {
        return left.includes(right)
      }
      if (Array.isArray(left)) {
        return left.includes(right)
      }
      return false
    case CONDITIONS.EMPTY:
      return isEmpty(left)
    case CONDITIONS.NOT_EMPTY:
      return !isEmpty(left)
    default:
      return false
  }
}

const evaluateFilter = (doc: Row, filter: ViewFilter) => {
  const value = doc?.[filter.key as keyof typeof doc]
  return evaluateComparator(value, filter.value, filter.condition)
}

const matchesFilters = (doc: Row, filters: ViewFilter[] = []) => {
  if (!filters.length) {
    return true
  }

  let result: boolean | undefined
  let pendingConjunction: string | undefined

  for (const filter of filters) {
    const current = evaluateFilter(doc, filter)
    if (result == null) {
      result = current
    } else if (pendingConjunction === CONJUNCTIONS.OR) {
      result = result || current
    } else {
      result = result && current
    }
    pendingConjunction = filter.conjunction
  }

  return result ?? true
}

const coerceKey = (value: any, groupByMulti?: boolean) => {
  if (!groupByMulti) {
    return [value]
  }
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

const requiresFieldValue = (meta: DBView["meta"]) => {
  if (!meta?.field) {
    return false
  }
  if (!meta.calculation) {
    return false
  }
  return true
}

const fieldHasValue = (doc: Row, field?: string) => {
  if (!field) {
    return true
  }
  return !isEmpty(doc?.[field as keyof typeof doc])
}

const assertMeta = (view: DBView) => {
  if (!view.meta) {
    throw new Error("Unable to interpret view map without metadata")
  }
}

const canIncludeDoc = (doc: Row, view: DBView) => {
  if (!view.meta) {
    return false
  }
  if (doc.tableId !== view.meta.tableId) {
    return false
  }
  if (!matchesFilters(doc, view.meta.filters || [])) {
    return false
  }
  if (requiresFieldValue(view.meta) && !fieldHasValue(doc, view.meta.field)) {
    return false
  }
  return true
}

export const buildMapFunction = (view: DBView) => {
  assertMeta(view)

  return (doc: Document & Row, emit: EmitFn) => {
    if (!canIncludeDoc(doc, view)) {
      return
    }
    const meta = view.meta!
    const keyField = meta.groupBy || "_id"
    const keyValue = coerceKey(
      doc[keyField as keyof typeof doc],
      meta.groupByMulti
    )
    const value = meta.field ? doc[meta.field as keyof typeof doc] : undefined
    for (const key of keyValue) {
      emit(key, value)
    }
  }
}
