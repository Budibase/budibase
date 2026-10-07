import { promises as fs } from "fs"
import { MongoClient } from "mongodb"
import {
  buildMongoClientOptions,
  MongoIntegration,
  type MongoDBConfig,
} from "../mongodb"
import { withEnv } from "../../environment"

describe("MongoDB Integration", () => {
  const baseConfig: MongoDBConfig = {
    connectionString: "mongodb://example.com:27017",
    db: "test",
    tlsCertificateKeyFile: "/etc/passwd",
    tlsCAFile: "/etc/shadow",
  }

  describe("buildMongoClientOptions", () => {
    it("drops tlsCertificateKeyFile and tlsCAFile when not self-hosted", () => {
      withEnv({ SELF_HOSTED: undefined }, () => {
        expect(buildMongoClientOptions(baseConfig)).toEqual({})
      })
    })

    it("passes tlsCertificateKeyFile and tlsCAFile through when self-hosted", () => {
      withEnv({ SELF_HOSTED: "true" }, () => {
        expect(buildMongoClientOptions(baseConfig)).toEqual({
          tlsCertificateKeyFile: "/etc/passwd",
          tlsCAFile: "/etc/shadow",
        })
      })
    })
  })

  describe("connection string TLS file options", () => {
    const fileOptions = ["tlsCAFile", "tlsCertificateKeyFile", "tlsCRLFile"]
    const policyError =
      "MongoDB TLS file options are only supported on self-hosted installations"

    it.each([
      { name: "mongodb with TLS", scheme: "mongodb", tls: "tls=true&" },
      { name: "mongodb with SSL alias", scheme: "mongodb", tls: "ssl=true&" },
      { name: "mongodb+srv with TLS", scheme: "mongodb+srv", tls: "tls=true&" },
      { name: "mongodb+srv with implicit TLS", scheme: "mongodb+srv", tls: "" },
    ])(
      "rejects normalized $name URI file options on cloud",
      async ({ scheme, tls }) => {
        await withEnv({ SELF_HOSTED: undefined }, async () => {
          for (const option of fileOptions) {
            const encoded = [...option]
              .map(
                character =>
                  `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`
              )
              .join("")
            for (const key of [option, option.toUpperCase(), encoded]) {
              const integration = new MongoIntegration({
                ...baseConfig,
                connectionString: `${scheme}://example.com/test?${tls}${key}=/file.pem`,
              })
              await expect(integration.connect()).rejects.toThrow(policyError)
            }
          }
        })
      }
    )

    it("returns the usual verification failure without reading a file or connecting", async () => {
      const readFile = jest.spyOn(fs, "readFile")
      const connect = jest.spyOn(MongoClient.prototype, "connect")
      try {
        await withEnv({ SELF_HOSTED: undefined }, async () => {
          const integration = new MongoIntegration({
            ...baseConfig,
            connectionString:
              "mongodb://example.com/?tls=true&tlsCertificateKeyFile=/file.pem",
          })
          await expect(integration.testConnection()).resolves.toEqual({
            connected: false,
            error: policyError,
          })
        })
        expect(readFile).not.toHaveBeenCalled()
        expect(connect).not.toHaveBeenCalled()
      } finally {
        readFile.mockRestore()
        connect.mockRestore()
      }
    })

    it("preserves ordinary cloud URI settings", async () => {
      await withEnv({ SELF_HOSTED: undefined }, async () => {
        const integration = new MongoIntegration({
          ...baseConfig,
          connectionString:
            "mongodb://example.com/test?tls=true&replicaSet=rs0&appName=tlsCAFile%3D%2Ffile.pem&readPreference=secondary",
        })

        expect(integration["client"].options).toMatchObject({
          tls: true,
          dbName: "test",
          replicaSet: "rs0",
          appName: "tlsCAFile=/file.pem",
          readPreference: { mode: "secondary" },
        })
        expect(integration["client"].options.tlsCAFile).toBeUndefined()
        expect(
          integration["client"].options.tlsCertificateKeyFile
        ).toBeUndefined()
        expect(integration["client"].options.tlsCRLFile).toBeUndefined()

        const connect = jest
          .spyOn(integration["client"], "connect")
          .mockResolvedValue(integration["client"])
        await integration.connect()
        expect(connect).toHaveBeenCalledTimes(1)
      })
    })

    it("preserves self-hosted URI TLS file options", async () => {
      await withEnv({ SELF_HOSTED: "true" }, async () => {
        const integration = new MongoIntegration({
          ...baseConfig,
          tlsCAFile: "",
          tlsCertificateKeyFile: "",
          connectionString:
            "mongodb://example.com/?tls=true&TLSCAFILE=/ca.pem&%74lsCertificateKeyFile=/key.pem&TlScRlFiLe=/crl.pem",
        })

        expect(integration["client"].options).toMatchObject({
          tls: true,
          tlsCAFile: "/ca.pem",
          tlsCertificateKeyFile: "/key.pem",
          tlsCRLFile: "/crl.pem",
        })

        const connect = jest
          .spyOn(integration["client"], "connect")
          .mockResolvedValue(integration["client"])
        await integration.connect()
        expect(connect).toHaveBeenCalledTimes(1)
      })
    })
  })
})
