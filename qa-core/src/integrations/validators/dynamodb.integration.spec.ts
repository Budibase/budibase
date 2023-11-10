import { GenericContainer } from "testcontainers"
import { env } from "@budibase/backend-core"

import dynamodb from "../../../../packages/server/src/integrations/dynamodb"
import { generator } from "../../shared"

jest.unmock("aws-sdk")

describe("datasource validators", () => {
  describe("dynamodb", () => {
    let connectionSettings: {
      user: string
      password: string
      url: string
    }

    beforeAll(async () => {
      const user = "root"
      const password = generator.hash()
      const container = await new GenericContainer("amazon/dynamodb-local")
        .withExposedPorts(8000)
        .start()

      connectionSettings = {
        user,
        password,
        url: `http://${container.getContainerIpAddress()}:${container.getMappedPort(
          8000
        )}`,
      }
      env._set("AWS_ACCESS_KEY_ID", "mockedkey")
      env._set("AWS_SECRET_ACCESS_KEY", "mockedsecret")
    })

    it("test valid connection string", async () => {
      const integration = new dynamodb.integration({
        endpoint: connectionSettings.url,
        region: "",
        accessKeyId: "",
        secretAccessKey: "",
      })

      const result = await integration.testConnection()
      expect(result).toEqual({ connected: true })
    })

    it("test wrong endpoint", async () => {
      const integration = new dynamodb.integration({
        endpoint: "http://wrong.url:2880",
        region: "",
        accessKeyId: "",
        secretAccessKey: "",
      })

      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error:
          "Inaccessible host: `wrong.url' at port `undefined'. This service may not be available in the `eu-west-1' region.",
      })
    })
  })
})
