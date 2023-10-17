import { GenericContainer } from "testcontainers"

import couchdb from "../../../../packages/server/src/integrations/couchdb"
import { generator } from "../../shared"

describe("datasource validators", () => {
  describe("couchdb", () => {
    let url: string

    beforeAll(async () => {
      const user = generator.first()
      const password = generator.hash()

      const container = await new GenericContainer("budibase/couchdb")
        .withExposedPorts(5984)
        .withEnv("COUCHDB_USER", user)
        .withEnv("COUCHDB_PASSWORD", password)
        .start()

      const host = container.getContainerIpAddress()
      const port = container.getMappedPort(5984)

      await container.exec([
        `curl`,
        `-u`,
        `${user}:${password}`,
        `-X`,
        `PUT`,
        `localhost:5984/db`,
      ])
      url = `http://${user}:${password}@${host}:${port}`
    })

    it("test valid connection string", async () => {
      const integration = new couchdb.integration({
        url,
        database: "db",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({ connected: true })
    })

    it("test invalid database", async () => {
      const integration = new couchdb.integration({
        url,
        database: "random_db",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
      })
    })

    it("test invalid url", async () => {
      const integration = new couchdb.integration({
        url: "http://invalid:123",
        database: "any",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error:
          "request to http://invalid:123/any failed, reason: getaddrinfo ENOTFOUND invalid",
      })
    })
  })
})
