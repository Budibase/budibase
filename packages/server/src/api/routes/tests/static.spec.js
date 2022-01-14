jest.mock("node-fetch")
jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn(),
  },
  DynamoDB: {
    DocumentClient: jest.fn(),
  },
  S3: jest.fn(() => ({
    getSignedUrl: jest.fn(() => {
      return "my-url"
    }),
  })),
}))

const setup = require("./utilities")

describe("/attachments", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let app

  afterAll(setup.afterAll)

  beforeEach(async () => {
    app = await config.init()
  })

  describe("generateSignedUrls", () => {
    let datasource

    beforeEach(async () => {
      datasource = await config.createDatasource({
        datasource: {
          type: "datasource",
          name: "Test",
          source: "S3",
          config: {},
        },
      })
    })

    it("should be able to generate a signed upload URL", async () => {
      const bucket = "foo"
      const key = "bar"
      const res = await request
        .post(`/api/attachments/${datasource._id}/url`)
        .send({ bucket, key })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.signedUrl).toEqual("my-url")
      expect(res.body.publicUrl).toEqual(
        `https://${bucket}.s3.eu-west-1.amazonaws.com/${key}`
      )
    })

    it("should handle an invalid datasource ID", async () => {
      const res = await request
        .post(`/api/attachments/foo/url`)
        .send({
          bucket: "foo",
          key: "bar",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)
      expect(res.body.message).toEqual(
        "The specified datasource could not be found"
      )
    })

    it("should require a bucket parameter", async () => {
      const res = await request
        .post(`/api/attachments/${datasource._id}/url`)
        .send({
          bucket: undefined,
          key: "bar",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)
      expect(res.body.message).toEqual("bucket and key values are required")
    })

    it("should require a key parameter", async () => {
      const res = await request
        .post(`/api/attachments/${datasource._id}/url`)
        .send({
          bucket: "foo",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)
      expect(res.body.message).toEqual("bucket and key values are required")
    })
  })
})
