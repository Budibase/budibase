import { tenancy, events } from "@budibase/backend-core"
import TestConfig from "../../../../tests/utilities/TestConfiguration"
import { backfill } from "../app/app"

describe("app backfill", () => {
  const config = new TestConfig()

  beforeEach(async () => {
    await config.init()
    jest.clearAllMocks()
  })

  afterEach(() => {
    config.end()
  })

  it("should backfill dev app", async () => {
    await config.doInContext(null, async () => {
      const db = tenancy.getAppDB({})

      await backfill(db)

      expect(events.app.created).toBeCalledTimes(1)
      expect(events.app.published).toBeCalledTimes(0)
    })
  })

  it("should backfill prod app", async () => {
    await config.doInContext(
      null,
      async () => {
        const db = tenancy.getAppDB({})

        await backfill(db)

        // expect(events.app.created).toBeCalledTimes(0)
        expect(events.app.published).toBeCalledTimes(1)
      },
      { prod: true }
    )
  })
})
