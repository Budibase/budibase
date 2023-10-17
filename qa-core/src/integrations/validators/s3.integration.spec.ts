import s3 from "../../../../packages/server/src/integrations/s3"
import { GenericContainer } from "testcontainers"

jest.unmock("aws-sdk")

describe("datasource validators", () => {
  describe("s3", () => {
    let host: string
    let port: number

    beforeAll(async () => {
      const container = await new GenericContainer("localstack/localstack")
        .withExposedPorts(4566)
        .withEnv("SERVICES", "s3")
        .withEnv("DEFAULT_REGION", "eu-west-1")
        .withEnv("AWS_ACCESS_KEY_ID", "testkey")
        .withEnv("AWS_SECRET_ACCESS_KEY", "testsecret")
        .start()

      host = container.getContainerIpAddress()
      port = container.getMappedPort(4566)
    })

    it("test valid connection", async () => {
      const integration = new s3.integration({
        region: "eu-west-1",
        accessKeyId: "testkey",
        secretAccessKey: "testsecret",
        s3ForcePathStyle: false,
        endpoint: `http://${host}:${port}`,
      })
      const result = await integration.testConnection()
      expect(result).toEqual({ connected: true })
    })

    it("test wrong endpoint", async () => {
      const integration = new s3.integration({
        region: "eu-west-2",
        accessKeyId: "testkey",
        secretAccessKey: "testsecret",
        s3ForcePathStyle: false,
        endpoint: `http://wrong:123`,
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error:
          "Inaccessible host: `wrong' at port `undefined'. This service may not be available in the `eu-west-2' region.",
      })
    })
  })
})
