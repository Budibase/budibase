import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { builderSocket } from "../../../websockets"

jest.mock("../../../websockets", () => ({
  initialise: jest.fn(),
  builderSocket: {
    emitAutomationUpdate: jest.fn(),
    emitAppPublish: jest.fn(),
  },
}))

describe("automation websocket updates", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => config.end())

  it.each(["post", "update"] as const)(
    "broadcasts the saved automation when created through %s",
    async method => {
      const request = createAutomationBuilder(config).onAppAction().build()

      const { automation } = await config.api.automation[method](request)

      expect(builderSocket?.emitAutomationUpdate).toHaveBeenCalledWith(
        expect.anything(),
        automation
      )
    }
  )

  it("broadcasts the saved automation revision after an update", async () => {
    const request = createAutomationBuilder(config).onAppAction().build()
    const { automation } = await config.api.automation.post(request)

    const { automation: updatedAutomation } =
      await config.api.automation.update({
        ...automation,
        name: "Updated automation",
      })

    expect(builderSocket?.emitAutomationUpdate).toHaveBeenLastCalledWith(
      expect.anything(),
      updatedAutomation
    )
  })
})
