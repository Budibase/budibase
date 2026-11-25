import type { LookupFunction } from "net"
import { DynamoDBIntegration } from "../dynamodb"
import {
  type ElasticsearchConfig,
  ElasticSearchIntegration,
} from "../elasticsearch"
import { MongoIntegration } from "../mongodb"
import s3 from "../s3"
import { withEnv } from "../../environment"
import { BLOCKED } from "./utils/outbound"

describe("Elasticsearch, S3, DynamoDB and MongoDB with the default blacklist", () => {
  describe("Elasticsearch", () => {
    it.each([
      "http://169.254.169.254",
      "http://127.0.0.1:9200",
      "http://localhost:9200",
      "https://user:password@127.0.0.1:9200",
      "http://[::ffff:169.254.169.254]",
    ])("does not connect to %s", async url => {
      const integration = new ElasticSearchIntegration({ url })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked host", async () => {
      const integration = new ElasticSearchIntegration({
        url: "http://127.0.0.1:9200",
      })

      await expect(
        integration.read({ index: "test", json: {} })
      ).rejects.toThrow(BLOCKED)
    })

    // The client builds its own agent from our options, so these read it back
    // from the client's connection.
    const connectionFor = async (config: ElasticsearchConfig) => {
      const client = await new ElasticSearchIntegration(config)["getClient"]()
      return client.connectionPool.connections[0]
    }

    // Matches a lookup that answers any hostname with `ip`.
    const pinnedTo = (ip: string) => ({
      asymmetricMatch: (lookup: LookupFunction) => {
        let address: unknown
        lookup("other.example.com", {}, (_error, result) => {
          address = result
        })
        return address === ip
      },
      toAsymmetricMatcher: () => `a lookup pinned to ${ip}`,
    })

    it.each([
      ["http://203.0.113.10:9200", "203.0.113.10"],
      ["http://[2001:db8::1]:9200", "2001:db8::1"],
    ])("pins the client's agent for %s to the checked IP", async (url, ip) => {
      expect(await connectionFor({ url })).toMatchObject({
        agent: { options: { lookup: pinnedTo(ip) } },
      })
    })

    it("passes the ssl options to the client's agent", async () => {
      const connection = await connectionFor({
        url: "https://203.0.113.10:9200",
        ssl: true,
        rejectUnauthorized: false,
        ca: "CA",
      })

      expect(connection).toMatchObject({
        agent: {
          options: {
            ca: "CA",
            rejectUnauthorized: false,
            lookup: pinnedTo("203.0.113.10"),
          },
        },
      })
    })

    it("leaves a login in the URL for the client to decode", async () => {
      const connection = await connectionFor({
        url: "http://user:p%40ss@203.0.113.10:9200",
      })

      expect(connection.headers.authorization).toBe(
        `Basic ${Buffer.from("user:p@ss").toString("base64")}`
      )
    })
  })

  const blockedEndpoints = [
    "http://169.254.169.254",
    "http://127.0.0.1:4566",
    "http://localhost:4566",
    "https://127.0.0.1:4566",
    "http://[::ffff:169.254.169.254]",
  ]

  describe("S3", () => {
    const config = {
      region: "us-east-1",
      accessKeyId: "test",
      secretAccessKey: "test",
      s3ForcePathStyle: true,
    }

    it.each(blockedEndpoints)("does not connect to %s", async endpoint => {
      const integration = new s3.integration({ ...config, endpoint })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked endpoint", async () => {
      const integration = new s3.integration({
        ...config,
        endpoint: "http://127.0.0.1:4566",
      })

      await expect(
        integration.readCsv({ bucket: "bucket", key: "key" })
      ).rejects.toThrow(BLOCKED)
    })
  })

  describe("DynamoDB", () => {
    const config = {
      region: "us-east-1",
      accessKeyId: "test",
      secretAccessKey: "test",
    }

    it.each(blockedEndpoints)("does not connect to %s", async endpoint => {
      const integration = new DynamoDBIntegration({ ...config, endpoint })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked endpoint", async () => {
      const integration = new DynamoDBIntegration({
        ...config,
        endpoint: "http://127.0.0.1:4566",
      })

      await expect(
        integration.scan({ table: "table", json: {}, index: null })
      ).rejects.toThrow(BLOCKED)
    })
  })

  describe("MongoDB", () => {
    const config = {
      connectionString: "mongodb://127.0.0.1:27017",
      db: "test",
      tlsCertificateKeyFile: "",
      tlsCAFile: "",
    }

    it.each([
      "mongodb://169.254.169.254:27017",
      "mongodb://127.0.0.1:27017",
      "mongodb://localhost:27017",
      "mongodb://[::ffff:169.254.169.254]:27017",
      "mongodb://203.0.113.10:27017,127.0.0.1:27017",
      "mongodb://%2Ftmp%2Fmongodb-27017.sock",
    ])("does not connect to %s", async connectionString => {
      const integration = new MongoIntegration({ ...config, connectionString })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked host", async () => {
      const integration = new MongoIntegration(config)

      await expect(
        integration.read({
          json: {},
          extra: { collection: "test", actionType: "find" },
        })
      ).rejects.toThrow(BLOCKED)
    })

    it("does not connect through a proxy", async () => {
      const integration = new MongoIntegration({
        ...config,
        connectionString:
          "mongodb://203.0.113.10:27017/?proxyHost=127.0.0.1&proxyPort=1080",
      })

      const response = await integration.testConnection()

      expect(response).toEqual({
        connected: false,
        error: "MongoDB proxy options are not supported",
      })
    })

    it.each([
      "mongodb://203.0.113.10:27017/?authMechanism=MONGODB-AWS",
      "mongodb://203.0.113.10:27017/?authMechanism=MONGODB-OIDC&authMechanismProperties=ENVIRONMENT:gcp,TOKEN_RESOURCE:test",
    ])(
      "does not use the server's cloud credentials on cloud for %s",
      async connectionString => {
        await withEnv({ SELF_HOSTED: undefined }, async () => {
          const integration = new MongoIntegration({
            ...config,
            connectionString,
          })

          const response = await integration.testConnection()

          expect(response.connected).toBe(false)
          expect(response.error).toContain("only supported on self-hosted")
        })
      }
    )
  })
})
