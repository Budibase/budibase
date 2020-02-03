import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields_AndIndexes,
} from "./specHelpers"
import { permission } from "../src/authApi/permissions"

describe("indexApi > listItems", () => {
  it("should pull items from one shard when only startRange and endRange params are equal", async () => {
    const { recordApi, indexApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )

    const record1 = recordApi.getNew("/customers", "customer")
    record1.surname = "Ledog"
    await recordApi.save(record1)

    const record2 = recordApi.getNew("/customers", "customer")
    record2.surname = "Zeecat"
    await recordApi.save(record2)

    const items_L_shard = await indexApi.listItems("/customersBySurname", {
      rangeStartParams: { surname: "L" },
      rangeEndParams: { surname: "L" },
    })
    expect(items_L_shard.length).toBe(1)
    expect(items_L_shard[0].key).toBe(record1.key)

    const items_Z_shard = await indexApi.listItems("/customersBySurname", {
      rangeStartParams: { surname: "Z" },
      rangeEndParams: { surname: "Z" },
    })
    expect(items_Z_shard.length).toBe(1)
    expect(items_Z_shard[0].key).toBe(record2.key)
  })

  it("should pull items from one shard when shard is within startRange and endRange params", async () => {
    const { recordApi, indexApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )

    const record1 = recordApi.getNew("/customers", "customer")
    record1.surname = "Ledog"
    await recordApi.save(record1)

    const record2 = recordApi.getNew("/customers", "customer")
    record2.surname = "Zeecat"
    await recordApi.save(record2)

    const items_L_shard = await indexApi.listItems("/customersBySurname", {
      rangeStartParams: { surname: "K" },
      rangeEndParams: { surname: "M" },
    })
    expect(items_L_shard.length).toBe(1)
    expect(items_L_shard[0].key).toBe(record1.key)
  })

  it("should pull items from multiple shards are withing startRange and endRange params", async () => {
    const { recordApi, indexApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )

    const record1 = recordApi.getNew("/customers", "customer")
    record1.surname = "Ledog"
    await recordApi.save(record1)

    const record2 = recordApi.getNew("/customers", "customer")
    record2.surname = "Zeecat"
    await recordApi.save(record2)

    const items_L_shard = await indexApi.listItems("/customersBySurname", {
      rangeStartParams: { surname: "K" },
      rangeEndParams: { surname: "Z" },
    })
    expect(items_L_shard.length).toBe(2)
    expect(items_L_shard[0].key).toBe(record1.key)
  })

  it("should filter items by given search phrase", async () => {
    const { recordApi, indexApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )

    const record1 = recordApi.getNew("/customers", "customer")
    record1.surname = "Ledog"
    await recordApi.save(record1)

    const record2 = recordApi.getNew("/customers", "customer")
    record2.surname = "Zeecat"
    await recordApi.save(record2)

    const results = await indexApi.listItems("/customer_index", {
      searchPhrase: "*cat",
    })
    expect(results.length).toBe(1)
    expect(results[0].surname).toBe("Zeecat")
  })

  it("should filter items by given search phrase, accross sharded whole index", async () => {
    const { recordApi, indexApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )

    const record1 = recordApi.getNew("/customers", "customer")
    record1.surname = "Ledog"
    await recordApi.save(record1)

    const record2 = recordApi.getNew("/customers", "customer")
    record2.surname = "Zeecat"
    await recordApi.save(record2)

    const results = await indexApi.listItems("/customersBySurname", {
      searchPhrase: "*cat",
    })
    expect(results.length).toBe(1)
    expect(results[0].surname).toBe("Zeecat")
  })

  it("should filter items by given search phrase, in single shard ", async () => {
    const { recordApi, indexApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )

    const record1 = recordApi.getNew("/customers", "customer")
    record1.surname = "Lecat"
    await recordApi.save(record1)

    const record2 = recordApi.getNew("/customers", "customer")
    record2.surname = "Zeecat"
    await recordApi.save(record2)

    const record3 = recordApi.getNew("/customers", "customer")
    record3.surname = "Zeedog"
    await recordApi.save(record3)

    const results = await indexApi.listItems("/customersBySurname", {
      searchPhrase: "*cat",
      rangeStartParams: { surname: "Z" },
      rangeEndParams: { surname: "Z" },
    })
    expect(results.length).toBe(1)
    expect(results[0].surname).toBe("Zeecat")
  })

  it("should throw error when user user does not have permission", async () => {
    const { indexApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )
    app.removePermission(permission.readIndex.get("/customersBySurname"))
    expect(indexApi.listItems("/customersBySurname")).rejects.toThrow(
      /Unauthorized/
    )
  })

  it("should not depend on having any other permissions", async () => {
    const { app, indexApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields_AndIndexes
    )
    app.withOnlyThisPermission(permission.readIndex.get("/customersBySurname"))
    await indexApi.listItems("/customersBySurname")
  })
})
