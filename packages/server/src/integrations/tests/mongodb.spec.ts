import { buildMongoClientOptions, MongoDBConfig } from "../mongodb"
import { withEnv } from "../../environment"

describe("MongoDB Integration", () => {
  const baseConfig: MongoDBConfig = {
    connectionString: "mongodb://localhost:27017",
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
})
