import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields,
} from "./specHelpers"
import { keys, filter } from "lodash/fp"
import { $ } from "../src/common"
import { permission } from "../src/authApi/permissions"

describe("recordApi > delete", () => {
  it("should remove every key in record's path", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    await recordApi.save(record)
    await recordApi.delete(record.key)

    const remainingKeys = $(recordApi._storeHandle.data, [
      keys,
      filter(k => k.startsWith(record.key)),
    ])

    expect(remainingKeys).toEqual([])
  })

  it("should remove every key in record's path, when record has child records", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    record.surname = "Ledog"

    await recordApi.save(record)

    const invoice = recordApi.getNew(`${record.key}/invoices`, "invoice")
    await recordApi.save(invoice)

    await recordApi.delete(record.key)

    const remainingKeys = $(recordApi._storeHandle.data, [
      keys,
      filter(k => k.startsWith(record.key)),
    ])

    expect(remainingKeys).toEqual([])
  })

  it("should throw error when user user does not have permission", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    const created = await recordApi.save(record)
    app.removePermission(
      permission.deleteRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    expect(recordApi.delete(created.key)).rejects.toThrow(/Unauthorized/)
  })

  it("should not depend on having any other permissions", async () => {
    const { recordApi, app, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const record = recordApi.getNew("/customers", "customer")
    const saved = await recordApi.save(record)
    app.withOnlyThisPermission(
      permission.deleteRecord.get(appHierarchy.customerRecord.nodeKey())
    )
    await recordApi.delete(saved.key)
  })
})
