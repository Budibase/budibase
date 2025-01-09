// Directly mock the AWS SDK
jest.mock("aws-sdk", () => ({
  S3: jest.fn(() => ({
    getSignedUrl: jest.fn(
      (operation, params) => `http://example.com/${params.Bucket}/${params.Key}`
    ),
    upload: jest.fn(() => ({ Contents: {} })),
  })),
}))

import { Datasource, SourceName } from "@budibase/types"
import { setEnv } from "../../../environment"
import { getRequest, getConfig, afterAll as _afterAll } from "./utilities"
import { constants } from "@budibase/backend-core"

describe("/static", () => {
  let request = getRequest()
  let config = getConfig()
  let cleanupEnv: () => void

  afterAll(() => {
    _afterAll()
    cleanupEnv()
  })

  beforeAll(async () => {
    cleanupEnv = setEnv({ SELF_HOSTED: "true" })
    await config.init()
  })

  describe("/app", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should serve the app by id", async () => {
      const headers = config.defaultHeaders()
      delete headers[constants.Header.APP_ID]

      const res = await request
        .get(`/${config.prodAppId}`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(config.prodAppId)
    })

    it("should serve the app by url", async () => {
      const headers = config.defaultHeaders()
      delete headers[constants.Header.APP_ID]

      const res = await request
        .get(`/app${config.getProdApp().url}`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(config.prodAppId)
    })

    it("should serve the app preview by id", async () => {
      const res = await request
        .get(`/${config.appId}`)
        .set(config.defaultHeaders())
        .expect(200)

      expect(res.body.appId).toBe(config.appId)
    })
  })

  describe("/attachments", () => {
    describe("generateSignedUrls", () => {
      let datasource: Datasource

      beforeEach(async () => {
        datasource = await config.createDatasource({
          datasource: {
            type: "datasource",
            name: "Test",
            source: SourceName.S3,
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
        expect(res.body.signedUrl).toEqual("http://example.com/foo/bar")
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

  describe("/app/preview", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should serve the builder preview", async () => {
      const headers = config.defaultHeaders()
      const res = await request.get(`/app/preview`).set(headers).expect(200)

      expect(res.body.appId).toBe(config.appId)
      expect(res.body.builderPreview).toBe(true)
    })
  })

  describe("/", () => {
    it("should move permanently from base call (public call)", async () => {
      const res = await request.get(`/`)
      expect(res.status).toEqual(301)
      expect(res.text).toEqual(
        `Redirecting to <a href="/builder">/builder</a>.`
      )
    })

    it("should not error when trying to get 'apple-touch-icon.png' (public call)", async () => {
      const res = await request.get(`/apple-touch-icon.png`)
      expect(res.status).toEqual(302)
      expect(res.text).toEqual(
        `Redirecting to <a href="/builder/bblogo.png">/builder/bblogo.png</a>.`
      )
    })
  })
})
