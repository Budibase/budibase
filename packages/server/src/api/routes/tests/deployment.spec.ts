const triggerAppBackupMock = jest.fn()
jest.mock("@budibase/pro", () => ({
  ...jest.requireActual("@budibase/pro"),
  backups: {
    triggerAppBackup: triggerAppBackupMock,
    addAppBackupProcessors: jest.fn(),
  },
}))
import setup from "./utilities"
import { events } from "@budibase/backend-core"
import { AppBackupTrigger } from "@budibase/types"

describe("/deployments", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    jest.clearAllMocks()
  })

  describe("deploy", () => {
    it("should deploy the application", async () => {
      await request
        .post(`/api/deploy`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(triggerAppBackupMock).toBeCalledTimes(1)
      expect(triggerAppBackupMock).toBeCalledWith(
        config.prodAppId,
        AppBackupTrigger.PUBLISH,
        { createdBy: config.userMetadataId }
      )
      expect((events.app.published as jest.Mock).mock.calls.length).toBe(1)
    })
  })
})
