import { constants, objectStore } from "@budibase/backend-core"
import { Datasource, SourceName } from "@budibase/types"
import fsp from "fs/promises"
import path from "path"
import { tmpdir } from "os"
import { setEnv } from "../../../environment"
import { afterAll as _afterAll, getConfig, getRequest } from "./utilities"

jest.mock("extract-zip", () => jest.fn())

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getProdWorkspaceId: jest.fn().mockReturnValue("app_prod_test123"),
    },
    objectStore: {
      ...actual.objectStore,
      upload: jest.fn(),
    },
  }
})

import extract from "extract-zip"

const mockedUpload = objectStore.upload as jest.MockedFunction<
  typeof objectStore.upload
>
const mockedExtract = extract as jest.MockedFunction<typeof extract>

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

    it("should serve the app by url", async () => {
      const headers = config.defaultHeaders()
      delete headers[constants.Header.APP_ID]

      const res = await request
        .get(`/app${config.getProdWorkspace().url}`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(config.prodWorkspaceId)
    })

    it("should serve the app preview by id", async () => {
      const res = await request
        .get(`/${config.devWorkspaceId}`)
        .set(config.defaultHeaders())
        .expect(200)

      expect(res.body.appId).toBe(config.devWorkspaceId)
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
            config: {
              accessKeyId: "bb",
              secretAccessKey: "bb",
            },
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

        expect(res.body.signedUrl).toStartWith(
          "https://foo.s3.eu-west-1.amazonaws.com/bar?"
        )
        expect(res.body.signedUrl).toContain("X-Amz-Algorithm=AWS4-HMAC-SHA256")
        expect(res.body.signedUrl).toContain("X-Amz-Credential=bb")
        expect(res.body.signedUrl).toContain("X-Amz-Date=")
        expect(res.body.signedUrl).toContain("X-Amz-Signature=")
        expect(res.body.signedUrl).toContain("X-Amz-Expires=900")
        expect(res.body.signedUrl).toContain("X-Amz-SignedHeaders=host")

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

  describe("/app/:appId/preview", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should serve the builder preview", async () => {
      const headers = config.defaultHeaders()
      const res = await request
        .get(`/app/${config.getDevWorkspaceId()}/preview`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(config.devWorkspaceId)
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

  describe("processPWAZip", () => {
    let tempDir: string

    beforeEach(async () => {
      jest.clearAllMocks()
      tempDir = path.join(tmpdir(), `pwa-test-${Date.now()}`)
      await fsp.mkdir(tempDir, { recursive: true })

      mockedExtract.mockImplementation(async (_zipPath: string, opts: any) => {
        await fsp.mkdir(opts.dir, { recursive: true })
        await fsp.cp(tempDir, opts.dir, { recursive: true })
      })
    })

    afterEach(async () => {
      await fsp.rm(tempDir, { recursive: true, force: true })
    })

    describe("path traversal prevention", () => {
      it("skips icons whose src attempts to escape the zip directory via ../ traversal", async () => {
        const sensitiveDir = path.join(tmpdir(), `sensitive-${Date.now()}`)
        await fsp.mkdir(sensitiveDir, { recursive: true })
        const sensitiveFile = path.join(sensitiveDir, "secret.png")
        await fsp.writeFile(sensitiveFile, "sensitive-data")

        try {
          const relativePath = path.relative(tempDir, sensitiveFile)
          const iconsJson = {
            icons: [
              {
                src: relativePath, // e.g. "../../sensitive-.../secret.png"
                sizes: "192x192",
                type: "image/png",
              },
            ],
          }
          await fsp.writeFile(
            path.join(tempDir, "icons.json"),
            JSON.stringify(iconsJson)
          )

          const res = await request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders())

          expect(res.status).toEqual(500)
          expect(res.body.message).toMatch(
            "No valid icons found in the zip file"
          )
          expect(mockedUpload).not.toHaveBeenCalled()
        } finally {
          await fsp.rm(sensitiveDir, { recursive: true, force: true })
        }
      })

      it("accepts icons whose src stays within the zip directory", async () => {
        const iconFile = path.join(tempDir, "icon-192.png")
        await fsp.writeFile(iconFile, "fake-png-data")

        const iconsJson = {
          icons: [
            {
              src: "icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        }
        await fsp.writeFile(
          path.join(tempDir, "icons.json"),
          JSON.stringify(iconsJson)
        )

        mockedUpload.mockResolvedValue({
          Key: "app_prod_test123/pwa/some-uuid.png",
        } as any)

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())
          .expect(200)

        expect(mockedUpload).toHaveBeenCalledTimes(1)
        expect(res.body.icons).toEqual([
          {
            src: "app_prod_test123/pwa/some-uuid.png",
            sizes: "192x192",
            type: "image/png",
          },
        ])
      })

      it("skips icons with an absolute src path outside the zip directory", async () => {
        const iconsJson = {
          icons: [
            {
              src: "/etc/passwd",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        }
        await fsp.writeFile(
          path.join(tempDir, "icons.json"),
          JSON.stringify(iconsJson)
        )

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(500)
        expect(res.body.message).toMatch("No valid icons found in the zip file")
        expect(mockedUpload).not.toHaveBeenCalled()
      })
    })
  })
})
