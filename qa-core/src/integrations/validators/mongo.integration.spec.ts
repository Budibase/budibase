import { GenericContainer } from "testcontainers"
import mongo from "../../../../packages/server/src/integrations/mongodb"
import { generator } from "../../shared"

jest.unmock("mongodb")

describe("datasource validators", () => {
  describe("mongo", () => {
    let connectionSettings: {
      user: string
      password: string
      host: string
      port: number
    }

    function getConnectionString(
      settings: Partial<typeof connectionSettings> = {}
    ) {
      const { user, password, host, port } = {
        ...connectionSettings,
        ...settings,
      }
      return `mongodb://${user}:${password}@${host}:${port}`
    }

    beforeAll(async () => {
      const user = generator.name()
      const password = generator.hash()
      const container = await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .withEnv("MONGO_INITDB_ROOT_USERNAME", user)
        .withEnv("MONGO_INITDB_ROOT_PASSWORD", password)
        .start()

      connectionSettings = {
        user,
        password,
        host: container.getContainerIpAddress(),
        port: container.getMappedPort(27017),
      }
    })

    it("test valid connection string", async () => {
      const integration = new mongo.integration({
        connectionString: getConnectionString(),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({ connected: true })
    })

    it("test invalid password", async () => {
      const integration = new mongo.integration({
        connectionString: getConnectionString({ password: "wrong" }),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error: "Authentication failed.",
      })
    })

    it("test invalid username", async () => {
      const integration = new mongo.integration({
        connectionString: getConnectionString({ user: "wrong" }),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error: "Authentication failed.",
      })
    })

    it("test invalid connection", async () => {
      const integration = new mongo.integration({
        connectionString: getConnectionString({ host: "http://nothinghere" }),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error: "getaddrinfo ENOTFOUND http",
      })
    })
  })
})
