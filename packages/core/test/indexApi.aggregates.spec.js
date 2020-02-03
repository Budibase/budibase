import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields_AndIndexes,
} from "./specHelpers"
import { permission } from "../src/authApi/permissions"

describe("aggregates", () => {
  it("should calculate correct totals, when no condition supplied", async () => {
    const { createInvoice, indexApi } = await setup()
    await createInvoice(10)
    await createInvoice(20)
    await createInvoice(30)
    const result = await indexApi.aggregates("/Outstanding Invoices")

    expect(result.all_invoices_by_type.Important.count).toBe(3)
    expect(result.all_invoices_by_type.Important.totalIncVat.max).toBe(30)
    expect(result.all_invoices_by_type.Important.totalIncVat.min).toBe(10)
    expect(result.all_invoices_by_type.Important.totalIncVat.sum).toBe(60)
    expect(result.all_invoices_by_type.Important.totalIncVat.mean).toBe(60 / 3)
  })

  it("should split totals into correct groups", async () => {
    const { createInvoice, indexApi } = await setup()
    await createInvoice(10, 0, "Important")
    await createInvoice(20, 0, "NotImportant")
    await createInvoice(30, 0, "NotImportant")
    const result = await indexApi.aggregates("/Outstanding Invoices")

    expect(result.all_invoices_by_type.Important.count).toBe(1)
    expect(result.all_invoices_by_type.NotImportant.count).toBe(2)
    expect(result.all_invoices_by_type.Important.totalIncVat.sum).toBe(10)
    expect(result.all_invoices_by_type.NotImportant.totalIncVat.sum).toBe(50)
  })

  it("should include all when all match condition", async () => {
    const { createInvoice, indexApi } = await setup()
    await createInvoice(10, 0, "Important", true)
    await createInvoice(10, 0, "Important", true)
    await createInvoice(10, 0, "Important", true)
    const result = await indexApi.aggregates("/Outstanding Invoices")

    expect(result.written_off.Important.count).toBe(3)
    expect(result.written_off.Important.totalIncVat.sum).toBe(30)
  })

  it("should add to '(none)' when group is blank, null or undefined", async () => {
    const { createInvoice, indexApi } = await setup()
    await createInvoice(10, 0, "", true)
    await createInvoice(10, 0, null, true)
    const result = await indexApi.aggregates("/Outstanding Invoices")

    expect(result.all_invoices_by_type["(none)"].count).toBe(2)
    expect(result.all_invoices_by_type["(none)"].totalIncVat.sum).toBe(20)
  })

  it("should not include those that do not match condition", async () => {
    const { createInvoice, indexApi } = await setup()
    await createInvoice(10, 0, "Important", true)
    await createInvoice(10, 0, "Important", true)
    await createInvoice(10, 0, "Important", false)
    const result = await indexApi.aggregates("/Outstanding Invoices")

    expect(result.written_off.Important.count).toBe(2)
    expect(result.written_off.Important.totalIncVat.sum).toBe(20)
  })

  it("should have 'all' group when no grouping supplied", async () => {
    const { createInvoice, indexApi } = await setup()
    await createInvoice(10, 0, "Important", true)
    await createInvoice(20, 0, "Important", true)
    const result = await indexApi.aggregates("/Outstanding Invoices")

    expect(result.all_invoices.all.count).toBe(2)
  })

  it("should calculate correct totals, sharded index - all records", async () => {
    const { createInvoice, indexApi, invoicesByOutstandingKey } = await setup()
    await createInvoice(10, 0, "Important")
    await createInvoice(20, 20, "Important")
    await createInvoice(30, 30, "Important")
    const result = await indexApi.aggregates(invoicesByOutstandingKey)

    expect(result.all_invoices_by_type.Important.count).toBe(3)
    expect(result.all_invoices_by_type.Important.totalIncVat.max).toBe(30)
    expect(result.all_invoices_by_type.Important.totalIncVat.min).toBe(10)
    expect(result.all_invoices_by_type.Important.totalIncVat.sum).toBe(60)
    expect(result.all_invoices_by_type.Important.totalIncVat.mean).toBe(60 / 3)
  })

  it("should calculate correct totals, sharded index - bounded by sharding", async () => {
    const { createInvoice, indexApi, invoicesByOutstandingKey } = await setup()
    await createInvoice(10, 0, "Important")
    await createInvoice(20, 20, "Important")
    await createInvoice(30, 30, "Important")
    const result = await indexApi.aggregates(
      invoicesByOutstandingKey,
      { totalIncVat: 10, paidAmount: 10 },
      { totalIncVat: 10, paidAmount: 10 }
    )

    expect(result.all_invoices_by_type.Important.count).toBe(2)
    expect(result.all_invoices_by_type.Important.totalIncVat.max).toBe(30)
    expect(result.all_invoices_by_type.Important.totalIncVat.min).toBe(20)
    expect(result.all_invoices_by_type.Important.totalIncVat.sum).toBe(50)
    expect(result.all_invoices_by_type.Important.totalIncVat.mean).toBe(50 / 2)
  })

  it("should throw error when user user does not have permission", async () => {
    const { app, indexApi } = await setup()
    app.removePermission(permission.readIndex.get("/customer_index"))

    let err
    try {
      await indexApi.aggregates("/customer_index")
    } catch (e) {
      err = e
    }

    expect(err).toBeDefined()
    expect(err.message.startsWith("Unauthorized")).toBeTruthy()
    //expect(indexApi.aggregates("/customer_index")).rejects.toThrow(/Unauthorized/);
  })

  it("should not depend on having any other permissions", async () => {
    const { app, indexApi } = await setup()
    app.withOnlyThisPermission(permission.readIndex.get("/customer_index"))
    await indexApi.aggregates("/customer_index")
  })
})

const setup = async () => {
  const { recordApi, app, indexApi } = await setupApphierarchy(
    basicAppHierarchyCreator_WithFields_AndIndexes
  )

  const customer = recordApi.getNew("/customers", "customer")
  await recordApi.save(customer)

  const createInvoice = async (
    totalAmount = 10,
    paidAmount = 0,
    type = "Important",
    writtenOff = false
  ) => {
    const invoice = recordApi.getNew(
      `/customers/${customer.id}/invoices`,
      "invoice"
    )
    invoice.totalIncVat = totalAmount
    invoice.paidAmount = paidAmount
    invoice.invoiceType = type
    invoice.isWrittenOff = writtenOff
    return await recordApi.save(invoice)
  }

  const invoicesByOutstandingKey = `/customers/${customer.id}/invoicesByOutstanding`

  return { createInvoice, indexApi, invoicesByOutstandingKey, app }
}
