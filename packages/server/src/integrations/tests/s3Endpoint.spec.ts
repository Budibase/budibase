import { S3 } from "@aws-sdk/client-s3"
import {
  blacklist,
  env as coreEnv,
  setEnv as setCoreEnv,
} from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import s3 from "../s3"

describe("S3 integration with a custom endpoint", () => {
  const bucket = `test-${generator.guid()}`
  let config: {
    region: string
    accessKeyId: string
    secretAccessKey: string
    s3ForcePathStyle: boolean
    endpoint: string
  }
  let resetBlacklistEnv: () => void

  beforeAll(async () => {
    config = {
      region: "us-east-1",
      accessKeyId: "budibase",
      secretAccessKey: "budibase",
      s3ForcePathStyle: true,
      endpoint: coreEnv.MINIO_URL!,
    }
    // The test endpoint runs on loopback, which the default blacklist blocks.
    resetBlacklistEnv = setCoreEnv({ BLACKLIST_IPS: "" })
    await blacklist.refreshBlacklist()
  })

  afterAll(async () => {
    resetBlacklistEnv()
    await blacklist.refreshBlacklist()
  })

  it("connects to an allowed endpoint", async () => {
    const integration = new s3.integration(config)

    const response = await integration.testConnection()

    expect(response).toEqual({ connected: true })
  })

  it("creates a bucket and reads its objects", async () => {
    const integration = new s3.integration(config)
    await integration.create({
      bucket,
      location: "",
      grantFullControl: "",
      grantRead: "",
      grantReadAcp: "",
      grantWrite: "",
      grantWriteAcp: "",
      extra: { acl: "private" },
    })
    const client = new S3({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
    await client.putObject({ Bucket: bucket, Key: "file.txt", Body: "hello" })

    const objects = await integration.read({
      bucket,
      delimiter: "",
      expectedBucketOwner: "",
      marker: "",
      maxKeys: 10,
      prefix: "",
    })

    expect(objects?.map(object => object.Key)).toEqual(["file.txt"])
  })

  it("does not connect to the endpoint with the default blacklist", async () => {
    resetBlacklistEnv()
    await blacklist.refreshBlacklist()
    const integration = new s3.integration(config)

    const response = await integration.testConnection()

    expect(response.connected).toBe(false)
    expect(response.error).toContain(
      "Host is blocked or could not be resolved safely."
    )
  })
})
