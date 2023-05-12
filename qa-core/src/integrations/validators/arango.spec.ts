import { GenericContainer, Wait } from "testcontainers"
import arangodb from "../../../../packages/server/src/integrations/arangodb"
import { generator } from "../../shared"

jest.unmock("arangojs")

describe("datasource validators", () => {
  describe("arangodb", () => {
    const validator = integrations.getValidator[SourceName.ARANGODB]

    let connectionSettings: {
      user: string
      password: string
      url: string
    }

    beforeAll(async () => {
      const user = "root"
      const password = generator.hash()
      const container = await new GenericContainer("arangodb")
        .withExposedPorts(8529)
        .withEnv("ARANGO_ROOT_PASSWORD", password)
        .withWaitStrategy(
          Wait.forLogMessage("is ready for business. Have fun!")
        )
        .start()

      connectionSettings = {
        user,
        password,
        url: `http://${container.getContainerIpAddress()}:${container.getMappedPort(
          8529
        )}`,
      }
    })

    it("test valid connection string", async () => {
      const result = await validator({
        url: connectionSettings.url,
        username: connectionSettings.user,
        password: connectionSettings.password,
        databaseName: "",
        collection: "",
      })
      expect(result).toBe(true)
    })

    it("test wrong password", async () => {
      const result = await validator({
        url: connectionSettings.url,
        username: connectionSettings.user,
        password: "wrong",
        databaseName: "",
        collection: "",
      })
      expect(result).toEqual({
        error: "not authorized to execute this request",
      })
    })

    it("test wrong url", async () => {
      const result = await validator({
        url: "http://not.here",
        username: connectionSettings.user,
        password: connectionSettings.password,
        databaseName: "",
        collection: "",
      })
      expect(result).toEqual({
        error: "getaddrinfo ENOTFOUND not.here",
      })
    })
  })
})
