import { devRevertProcessor } from "./devRevertProcessor"
import { DevRevertQueueData } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { basicTable } from "../../tests/utilities/structures"

describe("DevRevertProcessor", () => {
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
})
