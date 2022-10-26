const AWS = require("aws-sdk")
import { default as S3Integration } from "../s3"
jest.mock("aws-sdk")

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

  it("calls the delete method with the correct params ", async () => {
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
})
