import { DocumentType, VirtualDocumentType } from "@budibase/types"
import {
  getTableIdFromViewId,
  isDatasourceOrDatasourcePlusId,
  isQueryId,
  isTableId,
  isTableIdOrExternalTableId,
  isViewId,
} from "../ids"

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}`
}

describe("ids", () => {
  const oneOfEachId = Object.values(DocumentType).map(makeId)

  describe("isTableId", () => {
    it("should return true for table IDs", () => {
      const found = oneOfEachId.filter(isTableId)
      expect(found.length).toBe(1)
      expect(found[0].startsWith(`${DocumentType.TABLE}_`)).toBe(true)
    })
  })

  describe("isViewId", () => {
    it("should return true for view IDs", () => {
      const found = oneOfEachId.filter(isViewId)
      expect(found.length).toBe(1)
      expect(found[0].startsWith(`${VirtualDocumentType.VIEW}_`)).toBe(true)
    })
  })

  describe("isDatasourceOrDatasourcePlusId", () => {
    it("should return true for datasource IDs", () => {
      const found = oneOfEachId.filter(isDatasourceOrDatasourcePlusId)
      expect(found.length).toBe(2)
      expect(
        found.filter(id => id.startsWith(`${DocumentType.DATASOURCE_PLUS}_`))
          .length
      ).toBe(1)
    })
  })

  describe("isTableIdOrExternalTableId", () => {
    it("should return true for table IDs", () => {
      const found = oneOfEachId.filter(isTableIdOrExternalTableId)
      expect(found.length).toBe(1)
      expect(
        found.filter(id => id.startsWith(`${DocumentType.TABLE}_`)).length
      ).toBe(1)
    })

    it("should return true for external table IDs", () => {
      const externalTableId = `${DocumentType.DATASOURCE_PLUS}_12345__${DocumentType.TABLE}_67890`
      expect(isTableIdOrExternalTableId(externalTableId)).toBe(true)
    })
  })

  describe("isQueryId", () => {
    it("should return true for query IDs", () => {
      const found = oneOfEachId.filter(isQueryId)
      expect(found.length).toBe(1)
      expect(found[0].startsWith(`${DocumentType.QUERY}_`)).toBe(true)
    })
  })

  describe("getTableIdFromViewId", () => {
    it("should return the correct table ID for a given view ID", () => {
      const tableId = makeId(DocumentType.TABLE)
      const viewId = makeId(`${VirtualDocumentType.VIEW}_${tableId}`)
      expect(getTableIdFromViewId(viewId)).toBe(tableId)
    })

    it("should handle the weird sample data IDs", () => {
      const tableId = "ta_bb_employee"
      const viewId = makeId(`${VirtualDocumentType.VIEW}_${tableId}`)
      expect(getTableIdFromViewId(viewId)).toBe(tableId)
    })
  })
})
