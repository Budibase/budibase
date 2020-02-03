import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields,
} from "./specHelpers"

describe("get customId", () => {
  it("should generate an id with given value", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const customId = recordApi.customId("customer", "my_custom_id")
    expect(customId).toBe(`${appHierarchy.customerRecord.nodeId}-my_custom_id`)
  })

  it("should throw error when nodeName does not exist", async () => {
    const { recordApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    expect(() => recordApi.customId("not a node", "my_ custom_id")).toThrow()
  })
})

describe("set customId", () => {
  it("should generate custom id and set on given record", async () => {
    const { recordApi, appHierarchy } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const customer = recordApi.getNew("/customers", "customer")

    recordApi.setCustomId(customer, "my_custom_id")
    expect(customer.id).toBe(
      `${appHierarchy.customerRecord.nodeId}-my_custom_id`
    )
    expect(customer.key).toBe(
      `/customers/${appHierarchy.customerRecord.nodeId}-my_custom_id`
    )
  })
})
