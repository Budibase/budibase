import { constants, objectStore, roles } from "@budibase/backend-core"
import { BuiltinPermissionID, Datasource, SourceName } from "@budibase/types"
import fsp from "fs/promises"
import path from "path"
import { tmpdir } from "os"
import { setEnv } from "../../../environment"
import * as fileSystem from "../../../utilities/fileSystem"
import { afterAll as _afterAll, getConfig, getRequest } from "./utilities"

jest.mock("extract-zip", () => jest.fn())

jest.mock("../../../utilities/fileSystem", () => {
  const actual = jest.requireActual("../../../utilities/fileSystem")
  return {
    ...actual,
    shouldServeLocally: jest.fn(actual.shouldServeLocally),
  }
})

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
      const workspaceId = config.getProdWorkspaceId()

      const res = await request
        .get(`/app${config.getProdWorkspace().url}`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(workspaceId)
      expect(res.body.clientLibPath).toContain(
        `/api/assets/${workspaceId}/client?`
      )
    })

    it("should serve app-chat with the global client library path", async () => {
      const headers = config.defaultHeaders()
      delete headers[constants.Header.APP_ID]
      const workspaceId = config.getProdWorkspaceId()

      const res = await request
        .get(`/app-chat${config.getProdWorkspace().url}`)
        .set(headers)
        .expect(200)

      expect(res.body.appId).toBe(workspaceId)
      expect(res.body.clientLibPath).toContain("/api/assets/global/client?")
      expect(res.body.clientLibPath).not.toContain(
        `/api/assets/${workspaceId}/client?`
      )
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

      it("should require authorization to generate a signed upload URL", async () => {
        await request
          .post(`/api/attachments/${datasource._id}/url`)
          .send({
            bucket: "foo",
            key: "bar",
          })
          .expect("Content-Type", /json/)
          .expect(401)
      })

      it("should deny app users without write permissions", async () => {
        const readOnlyRole = await config.api.roles.save({
          name: "s3_signed_url_read_only",
          permissionId: BuiltinPermissionID.READ_ONLY,
          inherits: roles.BUILTIN_ROLE_IDS.PUBLIC,
        })
        await config.loginAsRole(readOnlyRole._id!, async () => {
          await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "bar",
            })
            .set(config.defaultHeaders())
            .expect("Content-Type", /json/)
            .expect(403)
        })
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

      it("should reject buckets that do not match a datasource bucket constraint", async () => {
        const constrainedDatasource = await config.createDatasource({
          datasource: {
            type: "datasource",
            name: "Constrained Test",
            source: SourceName.S3,
            config: {
              accessKeyId: "bb",
              secretAccessKey: "bb",
              bucket: "allowed-bucket",
            },
          },
        })

        const res = await request
          .post(`/api/attachments/${constrainedDatasource._id}/url`)
          .send({
            bucket: "other-bucket",
            key: "bar",
          })
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(400)

        expect(res.body.message).toEqual(
          "bucket must match the datasource configuration"
        )
      })

      it("should allow non-creator app users to generate a signed upload URL", async () => {
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          const res = await request
            .post(`/api/attachments/${datasource._id}/url`)
            .send({
              bucket: "foo",
              key: "bar",
            })
            .set(config.defaultHeaders())
            .expect("Content-Type", /json/)
            .expect(200)

          expect(res.body.signedUrl).toBeDefined()
          expect(res.body.publicUrl).toEqual(
            "https://foo.s3.eu-west-1.amazonaws.com/bar"
          )
        })
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

  describe("/api/assets/:appId/client", () => {
    it("should serve the global client library without an app ID header", async () => {
      const headers = config.defaultHeaders()
      delete headers[constants.Header.APP_ID]
      const shouldServeLocallyMock =
        fileSystem.shouldServeLocally as jest.MockedFunction<
          typeof fileSystem.shouldServeLocally
        >
      shouldServeLocallyMock.mockClear()
      const getReadStreamSpy = jest.spyOn(objectStore, "getReadStream")

      try {
        const res = await request
          .get("/api/assets/global/client")
          .set(headers)
          .expect(200)

        expect(res.headers["content-type"]).toContain("javascript")
        expect(shouldServeLocallyMock).not.toHaveBeenCalled()
        expect(getReadStreamSpy).not.toHaveBeenCalled()
      } finally {
        getReadStreamSpy.mockRestore()
      }
    })
  })

  describe("/", () => {
    it("should move permanently from base call (public call)", async () => {
      const res = await request.get(`/`)
      expect(res.status).toEqual(301)
      expect(res.text).toEqual("Redirecting to /builder.")
    })

    it("should not error when trying to get 'apple-touch-icon.png' (public call)", async () => {
      const res = await request.get(`/apple-touch-icon.png`)
      expect(res.status).toEqual(302)
      expect(res.text).toEqual("Redirecting to /builder/bblogo.png.")
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

          expect(res.status).toEqual(400)
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

      it("accepts a manifest.json zip layout", async () => {
        const iconFile = path.join(tempDir, "images", "icon-192.png")
        await fsp.mkdir(path.dirname(iconFile), { recursive: true })
        await fsp.writeFile(iconFile, "fake-png-data")

        const manifestJson = {
          icons: [
            {
              src: "images/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        }
        await fsp.writeFile(
          path.join(tempDir, "manifest.json"),
          JSON.stringify(manifestJson)
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

      it("derives icons from a folder-based PWA asset zip", async () => {
        await fsp.mkdir(path.join(tempDir, "android"), { recursive: true })
        await fsp.mkdir(path.join(tempDir, "ios"), { recursive: true })
        await fsp.writeFile(
          path.join(tempDir, "android", "launchericon-192x192.png"),
          "fake-png-data"
        )
        await fsp.writeFile(
          path.join(tempDir, "ios", "192.png"),
          "fake-png-data"
        )

        mockedUpload
          .mockResolvedValueOnce({
            Key: "app_prod_test123/pwa/icon-192.png",
          } as any)
          .mockResolvedValueOnce({
            Key: "app_prod_test123/pwa/icon-ios-192.png",
          } as any)

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "appstore-images.zip")
          .set(config.defaultHeaders())
          .expect(200)

        expect(mockedUpload).toHaveBeenCalledTimes(2)
        expect(res.body.icons).toEqual([
          {
            src: "app_prod_test123/pwa/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "app_prod_test123/pwa/icon-ios-192.png",
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

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("No valid icons found in the zip file")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a symlinked icons.json file", async () => {
        const sensitiveDir = path.join(tmpdir(), `sensitive-${Date.now()}`)
        await fsp.mkdir(sensitiveDir, { recursive: true })
        const sensitiveFile = path.join(sensitiveDir, "icons.json")
        await fsp.writeFile(
          sensitiveFile,
          JSON.stringify({
            icons: [
              {
                src: "icon-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          })
        )
        await fsp.writeFile(path.join(tempDir, "icon-192.png"), "fake-png-data")
        await fsp.symlink(sensitiveFile, path.join(tempDir, "icons.json"))

        try {
          const res = await request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders())

          expect(res.status).toEqual(400)
          expect(res.body.message).toMatch(
            "Invalid zip structure - missing icons.json"
          )
          expect(mockedUpload).not.toHaveBeenCalled()
        } finally {
          await fsp.rm(sensitiveDir, { recursive: true, force: true })
        }
      })

      it("skips icons whose src is a symlink to a file outside the zip directory", async () => {
        const sensitiveDir = path.join(tmpdir(), `sensitive-${Date.now()}`)
        await fsp.mkdir(sensitiveDir, { recursive: true })
        const sensitiveFile = path.join(sensitiveDir, "secret.png")
        await fsp.writeFile(sensitiveFile, "sensitive-data")
        await fsp.symlink(sensitiveFile, path.join(tempDir, "evil.png"))

        try {
          const iconsJson = {
            icons: [
              {
                src: "evil.png",
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

          expect(res.status).toEqual(400)
          expect(res.body.message).toMatch(
            "No valid icons found in the zip file"
          )
          expect(mockedUpload).not.toHaveBeenCalled()
        } finally {
          await fsp.rm(sensitiveDir, { recursive: true, force: true })
        }
      })
    })

    describe("resource limits", () => {
      const mockExtractWithEntries = (
        entries: { fileName: string; uncompressedSize: number }[]
      ) => {
        mockedExtract.mockImplementation(
          async (_zipPath: string, opts: any) => {
            await fsp.mkdir(opts.dir, { recursive: true })
            for (const entry of entries) {
              opts.onEntry?.(entry, {})
              if (!entry.fileName.endsWith("/")) {
                const dest = path.join(opts.dir, entry.fileName)
                await fsp.mkdir(path.dirname(dest), { recursive: true })
                await fsp.writeFile(dest, "x")
              }
            }
          }
        )
      }

      it("rejects a zip containing too many files", async () => {
        mockExtractWithEntries(
          Array.from({ length: 101 }, (_, i) => ({
            fileName: `icon-${i}.png`,
            uncompressedSize: 100,
          }))
        )

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("too many files")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a zip with a single oversized file", async () => {
        mockExtractWithEntries([
          { fileName: "icon.png", uncompressedSize: 11 * 1024 * 1024 },
        ])

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch('file "icon.png" exceeds')
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a zip whose total uncompressed size is too large", async () => {
        mockExtractWithEntries(
          Array.from({ length: 6 }, (_, i) => ({
            fileName: `icon-${i}.png`,
            uncompressedSize: 9 * 1024 * 1024,
          }))
        )

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("uncompressed contents exceed")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("rejects a zip that nests directories too deeply", async () => {
        mockExtractWithEntries([
          {
            fileName: "a/b/c/d/e/f/g/h/i/j/k/icon.png",
            uncompressedSize: 100,
          },
        ])

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())

        expect(res.status).toEqual(400)
        expect(res.body.message).toMatch("directory depth exceeds")
        expect(mockedUpload).not.toHaveBeenCalled()
      })

      it("does not count __MACOSX entries against the file limit", async () => {
        const entries = [
          ...Array.from({ length: 60 }, (_, i) => ({
            fileName: `__MACOSX/icon-${i}.png`,
            uncompressedSize: 100,
          })),
          { fileName: "icon-192.png", uncompressedSize: 100 },
          {
            fileName: "icons.json",
            uncompressedSize: 100,
          },
        ]
        mockedExtract.mockImplementation(
          async (_zipPath: string, opts: any) => {
            await fsp.mkdir(opts.dir, { recursive: true })
            for (const entry of entries) {
              opts.onEntry?.(entry, {})
            }
            await fsp.writeFile(
              path.join(opts.dir, "icons.json"),
              JSON.stringify({
                icons: [
                  { src: "icon-192.png", sizes: "192x192", type: "image/png" },
                ],
              })
            )
            await fsp.writeFile(
              path.join(opts.dir, "icon-192.png"),
              "fake-png-data"
            )
          }
        )
        mockedUpload.mockResolvedValue({
          Key: "app_prod_test123/pwa/some-uuid.png",
        } as any)

        const res = await request
          .post("/api/pwa/process-zip")
          .attach("file", Buffer.from("fake-zip"), "icons.zip")
          .set(config.defaultHeaders())
          .expect(200)

        expect(res.body.icons).toHaveLength(1)
      })

      it("removes the temporary extraction directory once finished", async () => {
        const rmSpy = jest.spyOn(fsp, "rm")
        try {
          mockExtractWithEntries([
            { fileName: "icon.png", uncompressedSize: 11 * 1024 * 1024 },
          ])

          await request
            .post("/api/pwa/process-zip")
            .attach("file", Buffer.from("fake-zip"), "icons.zip")
            .set(config.defaultHeaders())

          const cleanedTempDir = rmSpy.mock.calls.some(
            ([target]) =>
              typeof target === "string" &&
              target.includes(`${path.sep}pwa-`) &&
              !target.includes("pwa-test-")
          )
          expect(cleanedTempDir).toBe(true)
        } finally {
          rmSpy.mockRestore()
        }
      })
    })
  })
})
