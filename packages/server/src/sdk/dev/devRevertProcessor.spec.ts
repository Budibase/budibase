import { devRevertProcessor } from "./devRevertProcessor"
import { DevRevertQueueData } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { basicTable } from "../../tests/utilities/structures"
import { db } from "@budibase/backend-core"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    db: {
      ...actual.db,
      Replication: actual.db.Replication,
    },
  }
})

describe("devRevertProcessor", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  it("should always return singleton instance", () => {
    const processor1 = devRevertProcessor()
    const processor2 = devRevertProcessor()
    expect(processor1).toBe(processor2)
  })

  it("should revert dev changes", async () => {
    const newDevTable = await config.api.table.save(basicTable())

    const processor = devRevertProcessor()
    const testData: DevRevertQueueData = {
      appId: config.getAppId(),
      userId: generator.guid(),
    }

    await config.api.table.get(newDevTable._id!, { status: 200 })
    const result = await processor.execute(testData)

    expect(result).toEqual({
      success: true,
      result: { message: "Reverted changes successfully." },
    })

    await config.api.table.get(newDevTable._id!, { status: 404 })
  })

  describe("unhappy paths", () => {
    it("should throw error when app is not deployed", async () => {
      await config.unpublish()

      const processor = devRevertProcessor()
      const testData: DevRevertQueueData = {
        appId: config.getAppId(),
        userId: generator.guid(),
      }

      await expect(processor.execute(testData)).rejects.toThrow(
        "App has not yet been deployed"
      )
    })

    it("should recover from replication errors during rollback", async () => {
      await config.api.table.save(basicTable())

      async function verifyDevApp(exists: boolean) {
        expect(await db.dbExists(config.getAppId())).toBe(exists)
      }

      const verifyDevAppExists = () => verifyDevApp(true)

      const revertAppSpy = jest
        .spyOn(db.Replication.prototype, "replicate")
        .mockRejectedValueOnce(new Error("Replication failed"))

      const processor = devRevertProcessor()

      const testData: DevRevertQueueData = {
        appId: config.getAppId(),
        userId: generator.guid(),
      }

      await verifyDevAppExists()
      const result = await processor.execute(testData)

      expect(result).toEqual({
        success: true,
        result: { message: "Reverted changes successfully." },
      })

      expect(revertAppSpy).toHaveBeenCalledTimes(2)
      await verifyDevAppExists()

      const devDocs = await db.getDB(config.getAppId()).allDocs({
        include_docs: true,
      })
      const prodDocs = await db.getDB(config.getProdAppId()).allDocs({
        include_docs: true,
      })
      expect(devDocs.total_rows).toEqual(prodDocs.total_rows)
    })
  })
})
