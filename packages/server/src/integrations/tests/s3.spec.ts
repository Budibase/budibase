import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  default as S3Integration,
  DEFAULT_SIGNED_URL_EXPIRY_SECONDS,
  MAX_SIGNED_URL_EXPIRY_SECONDS,
} from "../s3"
import { enrichContext } from "../../sdk/workspace/queries/queries"

jest.mock("../../sdk/utils", () => ({
  getEnvironmentVariables: jest.fn(() => ({})),
}))
jest.mock("@aws-sdk/client-s3", () => {
  class S3Mock {
    response(body: any, extra?: any) {
      return () => ({
        promise: () => body,
        ...extra,
      })
    }

    listObjects = jest.fn(
      this.response({
        Contents: [],
      })
    )
    createBucket = jest.fn(
      this.response({
        Contents: {},
      })
    )
    deleteObjects = jest.fn(
      this.response({
        Contents: {},
      })
    )
    headBucket = jest.fn(
      this.response({
        Contents: {},
      })
    )
    upload = jest.fn(
      this.response({
        Contents: {},
      })
    )
    getObject = jest.fn(
      this.response(
        {
          Body: "",
        },
        {
          createReadStream: jest.fn().mockReturnValue("stream"),
        }
      )
    )
  }

  class GetObjectCommandMock {
    constructor(public input: any) {}
  }

  return { S3: S3Mock, GetObjectCommand: GetObjectCommandMock }
})
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(async () => "https://example.com/signed"),
}))

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new S3Integration.integration(config)
  }
}

describe("S3 Integration", () => {
  let config: any

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the read method with the correct params", async () => {
    await config.integration.read({
      bucket: "test",
      delimiter: "/",
      marker: "file.txt",
      maxKeys: 999,
      prefix: "directory/",
    })
    expect(config.integration.client.listObjects).toHaveBeenCalledWith({
      Bucket: "test",
      Delimiter: "/",
      Marker: "file.txt",
      MaxKeys: 999,
      Prefix: "directory/",
    })
  })

  it("calls the create method with the correct params", async () => {
    await config.integration.create({
      bucket: "test",
      location: "af-south-1",
      grantFullControl: "me",
      grantRead: "him",
      grantReadAcp: "her",
      grantWrite: "she",
      grantWriteAcp: "he",
      objectLockEnabledForBucket: true,
      extra: {
        acl: "private",
      },
    })
    expect(config.integration.client.createBucket).toHaveBeenCalledWith({
      Bucket: "test",
      CreateBucketConfiguration: {
        LocationConstraint: "af-south-1",
      },
      GrantFullControl: "me",
      GrantRead: "him",
      GrantReadACP: "her",
      GrantWrite: "she",
      GrantWriteACP: "he",
      ACL: "private",
    })
  })

  it("does not add undefined location constraint when calling the create method", async () => {
    await config.integration.create({
      bucket: "test",
    })
    expect(config.integration.client.createBucket).toHaveBeenCalledWith({
      Bucket: "test",
      GrantFullControl: undefined,
      GrantRead: undefined,
      GrantReadACP: undefined,
      GrantWrite: undefined,
      GrantWriteACP: undefined,
      ACL: undefined,
    })
  })

  it.each(["safe.txt", 'safe.txt"},{"Key":"victim.txt'])(
    "passes the enriched delete key unchanged to S3: %s",
    async key => {
      const query = await enrichContext(
        {
          bucket: "test",
          delete: '{"Objects":[{"Key":"{{ key }}"}]}',
        },
        { key }
      )

      await config.integration.delete(query)

      expect(config.integration.client.deleteObjects).toHaveBeenCalledWith({
        Bucket: "test",
        Delete: { Objects: [{ Key: key }] },
      })
    }
  )

  it("calls the delete method with the correct params", async () => {
    await config.integration.delete({
      bucket: "test",
      delete: `{
        "Objects": [
          {
         "Key": "HappyFace.jpg", 
         "VersionId": "2LWg7lQLnY41.maGB5Z6SWW.dcq0vx7b"
        }, 
          {
         "Key": "HappyFace.jpg", 
         "VersionId": "yoz3HB.ZhCS_tKVEmIOr7qYyyAaZSKVd"
        }
       ]
      }`,
    })
    expect(config.integration.client.deleteObjects).toHaveBeenCalledWith({
      Bucket: "test",
      Delete: {
        Objects: [
          {
            Key: "HappyFace.jpg",
            VersionId: "2LWg7lQLnY41.maGB5Z6SWW.dcq0vx7b",
          },
          {
            Key: "HappyFace.jpg",
            VersionId: "yoz3HB.ZhCS_tKVEmIOr7qYyyAaZSKVd",
          },
        ],
      },
    })
  })

  describe("getSignedUrl", () => {
    const now = new Date("2026-01-01T00:00:00.000Z")
    const getSignedUrlMock = jest.mocked(getSignedUrl)

    beforeEach(() => {
      jest.useFakeTimers({ now })
      getSignedUrlMock.mockClear()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    const expiresAtFor = (seconds: number) =>
      new Date(now.getTime() + seconds * 1000).toISOString()

    it("signs a GetObject request for the given bucket and key", async () => {
      const result = await config.integration.getSignedUrl({
        bucket: "test",
        key: "invoices/1.pdf",
        expiresIn: 60,
      })

      expect(result).toEqual([
        { url: "https://example.com/signed", expiresAt: expiresAtFor(60) },
      ])
      expect(getSignedUrlMock).toHaveBeenCalledWith(
        config.integration.client,
        expect.any(GetObjectCommand),
        { expiresIn: 60, signingDate: now }
      )
      expect(getSignedUrlMock.mock.calls[0][1].input).toEqual({
        Bucket: "test",
        Key: "invoices/1.pdf",
        ResponseContentDisposition: undefined,
        ResponseContentType: undefined,
      })
    })

    it.each([undefined, ""])(
      "applies the default expiry when expiresIn is %p",
      async expiresIn => {
        const result = await config.integration.getSignedUrl({
          bucket: "test",
          key: "file.txt",
          expiresIn,
        })

        expect(getSignedUrlMock.mock.calls[0][2]).toEqual({
          expiresIn: DEFAULT_SIGNED_URL_EXPIRY_SECONDS,
          signingDate: now,
        })
        expect(result[0].expiresAt).toEqual(
          expiresAtFor(DEFAULT_SIGNED_URL_EXPIRY_SECONDS)
        )
      }
    )

    it("parses a numeric string expiry", async () => {
      await config.integration.getSignedUrl({
        bucket: "test",
        key: "file.txt",
        expiresIn: "120",
      })

      expect(getSignedUrlMock.mock.calls[0][2]).toEqual({
        expiresIn: 120,
        signingDate: now,
      })
    })

    it("clamps the expiry to the maximum", async () => {
      const result = await config.integration.getSignedUrl({
        bucket: "test",
        key: "file.txt",
        expiresIn: MAX_SIGNED_URL_EXPIRY_SECONDS * 10,
      })

      expect(getSignedUrlMock.mock.calls[0][2]).toEqual({
        expiresIn: MAX_SIGNED_URL_EXPIRY_SECONDS,
        signingDate: now,
      })
      expect(result[0].expiresAt).toEqual(
        expiresAtFor(MAX_SIGNED_URL_EXPIRY_SECONDS)
      )
    })

    it("passes response headers through to GetObjectCommand", async () => {
      await config.integration.getSignedUrl({
        bucket: "test",
        key: "file.pdf",
        responseContentDisposition: 'attachment; filename="Invoice.pdf"',
        responseContentType: "application/pdf",
      })

      expect(getSignedUrlMock.mock.calls[0][1].input).toEqual({
        Bucket: "test",
        Key: "file.pdf",
        ResponseContentDisposition: 'attachment; filename="Invoice.pdf"',
        ResponseContentType: "application/pdf",
      })
    })

    it.each([
      [{ bucket: "", key: "file.txt" }, "Bucket is required"],
      [{ bucket: "test", key: "" }, "Key is required"],
      [{ bucket: "test", key: "   " }, "Key is required"],
      [{ bucket: "test" }, "Key is required"],
    ])("rejects missing bucket or key: %p", async (query, message) => {
      await expect(config.integration.getSignedUrl(query)).rejects.toThrow(
        message
      )
      expect(getSignedUrlMock).not.toHaveBeenCalled()
    })

    it.each(["abc", 0, -10, 0.5])(
      "rejects invalid expiry %p",
      async expiresIn => {
        await expect(
          config.integration.getSignedUrl({
            bucket: "test",
            key: "file.txt",
            expiresIn,
          })
        ).rejects.toThrow("Expiry must be a positive number of seconds")
        expect(getSignedUrlMock).not.toHaveBeenCalled()
      }
    )
  })
})
