import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields,
  getNewFieldAndAdd,
} from "./specHelpers"
import { joinKey } from "../src/common"
import { isFunction, isArray } from "lodash"

describe("recordApi > getContext", () => {
  it("'referenceExists()' should return true when the reference is in the index", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const customer = recordApi.getNew(
      appHierarchy.customerRecord.collectionNodeKey(),
      "customer"
    )
    customer.isalive = true
    await recordApi.save(customer)

    const invoiceCollectionKey = joinKey(customer.key, "invoices")
    const invoice = recordApi.getNew(invoiceCollectionKey, "invoice")

    const context = await recordApi.getContext(invoice.key)

    expect(isFunction(context.referenceExists)).toBeTruthy()
    const result = await context.referenceExists("customer", customer.key)
    expect(result).toBe(true)
  })

  it("'referenceExists()' should return false when the reference is not in the index", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const customer = recordApi.getNew(
      appHierarchy.customerRecord.collectionNodeKey(),
      "customer"
    )
    customer.isalive = true
    await recordApi.save(customer)

    const invoiceCollectionKey = joinKey(customer.key, "invoices")
    const invoice = recordApi.getNew(invoiceCollectionKey, "invoice")

    const context = await recordApi.getContext(invoice.key)

    const result = await context.referenceExists("customer", "not a key")
    expect(result).toBe(false)
  })

  it("referenceOptions() should return list of indexed {key, value}", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const customer = recordApi.getNew(
      appHierarchy.customerRecord.collectionNodeKey(),
      "customer"
    )
    customer.surname = "Leedog"
    customer.isalive = true
    await recordApi.save(customer)

    const invoiceCollectionKey = joinKey(customer.key, "invoices")
    const invoice = recordApi.getNew(invoiceCollectionKey, "invoice")

    const context = await recordApi.getContext(invoice.key)

    expect(isFunction(context.referenceOptions)).toBeTruthy()
    const result = await context.referenceOptions("customer")
    expect(isArray(result)).toBeTruthy()
    expect(result[0].key).toBe(customer.key)
    expect(result[0].value).toBe(customer.surname)
  })

  it("referenceOptions() should return an empty list when no records are in the index", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )

    const customer = recordApi.getNew(
      appHierarchy.customerRecord.collectionNodeKey(),
      "customer"
    )
    customer.surname = "Leedog"
    customer.isalive = false
    await recordApi.save(customer)

    const invoiceCollectionKey = joinKey(customer.key, "invoices")
    const invoice = recordApi.getNew(invoiceCollectionKey, "invoice")

    const context = await recordApi.getContext(invoice.key)

    expect(isFunction(context.referenceOptions)).toBeTruthy()
    const result = await context.referenceOptions("customer")
    expect(isArray(result)).toBeTruthy()
    expect(result.length).toBe(0)
  })
})
