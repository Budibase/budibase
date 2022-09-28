const AWS = require("aws-sdk")
import { default as S3Integration } from "../s3"
jest.mock("aws-sdk")

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new S3Integration.integration(config)
  }
}

describe("S3 Integration", () => {
  let config: any

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the read method with the correct params", async () => {
    const response = await config.integration.read({
      bucket: "test",
    })
    expect(config.integration.client.listObjects).toHaveBeenCalledWith({
      Bucket: "test",
    })
  })
})
