const { testAutomation } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { MetadataTypes } = require("../../../constants")

describe("/metadata", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let automation

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    automation = await config.createAutomation()
  })

  async function createMetadata(data, type = MetadataTypes.AUTOMATION_TEST_INPUT) {
    const res = await request
      .post(`/api/metadata/${type}/${automation._id}`)
      .send(data)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body._rev).toBeDefined()
  }

  async function getMetadata(type) {
    const res = await request
      .get(`/api/metadata/${type}/${automation._id}`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body
  }

  describe("save", () => {
    it("should be able to save some metadata", async () => {
      await createMetadata({ test: "a" })
      const testInput = await getMetadata(MetadataTypes.AUTOMATION_TEST_INPUT)
      expect(testInput.test).toBe("a")
    })

    it("should save history metadata on automation run", async () => {
      // this should have created some history
      await testAutomation(config, automation)
      const metadata = await getMetadata(MetadataTypes.AUTOMATION_TEST_HISTORY)
      expect(metadata).toBeDefined()
      expect(metadata.history.length).toBe(1)
      expect(typeof metadata.history[0].occurredAt).toBe("number")
    })
  })

  describe("destroy", () => {
    it("should be able to delete some test inputs", async () => {
      const res = await request
        .delete(`/api/metadata/${MetadataTypes.AUTOMATION_TEST_INPUT}/${automation._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toBeDefined()
      const metadata = await getMetadata(MetadataTypes.AUTOMATION_TEST_INPUT)
      expect(metadata.test).toBeUndefined()
    })
  })
})
