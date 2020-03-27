import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields,
  stubEventHandler,
  basicAppHierarchyCreator_WithFields_AndIndexes,
} from "./specHelpers"
import { canDeleteIndex } from "../src/templateApi/canDeleteIndex"
import { canDeleteRecord } from "../src/templateApi/canDeleteRecord"

describe("canDeleteIndex", () => {
  it("should return no errors if deltion is valid", async () => {
    const { appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const partnerIndex = appHierarchy.root.indexes.find(i => i.name === "partner_index")

    const result = canDeleteIndex(partnerIndex)

    expect(result.canDelete).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("should return errors if index is a lookup for a reference field", async () => {
    const { appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const customerIndex = appHierarchy.root.indexes.find(i => i.name === "customer_index")

    const result = canDeleteIndex(customerIndex)

    expect(result.canDelete).toBe(false)
    expect(result.errors.length).toBe(1)
  })

  it("should return errors if index is a manyToOne index for a reference field", async () => {
    const { appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const referredToCustomersIndex = appHierarchy.customerRecord.indexes.find(i => i.name === "referredToCustomers")

    const result = canDeleteIndex(referredToCustomersIndex)

    expect(result.canDelete).toBe(false)
    expect(result.errors.length).toBe(1)
  })
})


describe("canDeleteRecord", () => {
  it("should return no errors when deletion is valid", async () => {
    const { appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    appHierarchy.root.indexes = appHierarchy.root.indexes.filter(i => !i.allowedRecordNodeIds.includes(appHierarchy.customerRecord.nodeId))
    const result = canDeleteRecord(appHierarchy.customerRecord)

    expect(result.canDelete).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("should return errors when record is referenced by hierarchal index", async () => {
    const { appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const result = canDeleteRecord(appHierarchy.customerRecord)

    expect(result.canDelete).toBe(false)
    expect(result.errors.some(e => e.includes("customer_index"))).toBe(true)
  })

  it("should return errors when record has a child which cannot be deleted", async () => {
    const { appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )

    const result = canDeleteRecord(appHierarchy.customerRecord)

    expect(result.canDelete).toBe(false)
    expect(result.errors.some(e => e.includes("Outstanding Invoices"))).toBe(true)
  })
})