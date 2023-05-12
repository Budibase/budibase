import { GenericContainer } from "testcontainers"
import mongodb from "../../../../packages/server/src/integrations/mongodb"

jest.unmock("mongodb")

describe("datasource validators", () => {
  describe("mongo", () => {
    const validator = integrations.getValidator[SourceName.MONGODB]

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
      const result = await validator({
        connectionString: getConnectionString(),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      expect(result).toBe(true)
    })

    it("test invalid password", async () => {
      const result = await validator({
        connectionString: getConnectionString({ password: "wrong" }),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      expect(result).toEqual({ error: "Authentication failed." })
    })

    it("test invalid username", async () => {
      const result = await validator({
        connectionString: getConnectionString({ user: "wrong" }),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      expect(result).toEqual({ error: "Authentication failed." })
    })

    it("test invalid connection", async () => {
      const result = await validator({
        connectionString: getConnectionString({ host: "http://nothinghere" }),
        db: "",
        tlsCertificateFile: "",
        tlsCertificateKeyFile: "",
        tlsCAFile: "",
      })
      expect(result).toEqual({ error: "Error: getaddrinfo ENOTFOUND http" })
    })
  })
})
