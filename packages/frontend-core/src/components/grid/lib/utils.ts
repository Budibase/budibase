import { GeneratedIDPrefix, CellIDSeparator } from "./constants"
import { Helpers } from "@budibase/bbui"

export const parseCellID = (cellId: string | null) => {
  if (!cellId) {
    return { rowId: undefined, field: undefined }
  }
  const parts = cellId.split(CellIDSeparator)
  const field = parts.pop()
  return { rowId: parts.join(CellIDSeparator), field }
}

export const getCellID = (rowId: string, fieldName: string) => {
  return `${rowId}${CellIDSeparator}${fieldName}`
}

export const parseEventLocation = (event: MouseEvent | TouchEvent) => {
  const e = event as MouseEvent & TouchEvent

  return {
    x: e.clientX ?? e.touches?.[0]?.clientX,
    y: e.clientY ?? e.touches?.[0]?.clientY,
  }
}

export const generateRowID = () => {
  return `${GeneratedIDPrefix}${Helpers.uuid()}`
}

export const isGeneratedRowID = (id: string) => {
  return id?.startsWith(GeneratedIDPrefix)
}
