import { Upload } from "@aws-sdk/lib-storage"
import { PassThrough } from "stream"
import { structures } from "../../../tests"
import { streamUpload, upload } from "../objectStore"

// Get mock instances
const mockUpload = Upload as jest.MockedClass<typeof Upload>

describe("objectStore", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("upload", () => {
    let body: Buffer
    beforeEach(() => {
      body = Buffer.from(structures.generator.paragraph())
    })

    it("should upload with application/javascript for .js files", async () => {
      await upload({
        bucket: "test-bucket",
        filename: "budibase-client.js",
        body,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "budibase-client.js",
          Body: body,
          ContentType: "application/javascript",
        },
      })
    })

    it("should upload with application/json for .json files", async () => {
      await upload({
        bucket: "test-bucket",
        filename: "manifest.json",
        body,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "manifest.json",
          Body: body,
          ContentType: "application/json",
        },
      })
    })

    it("should upload with image for .svg files", async () => {
      await upload({
        bucket: "test-bucket",
        filename: "icon.svg",
        body,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "icon.svg",
          Body: body,
          ContentType: "image/svg+xml",
        },
      })
    })

    it("should not override explicit ContentType", async () => {
      await upload({
        bucket: "test-bucket",
        filename: "manifest.json",
        body,
        type: "application/custom",
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "manifest.json",
          Body: body,
          ContentType: "application/custom",
        },
      })
    })

    it("should not add ContentType for unsupported extensions", async () => {
      await upload({
        bucket: "test-bucket",
        filename: "file.unknown",
        body,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "file.unknown",
          Body: body,
          ContentType: undefined,
        },
      })
    })

    it("should handle nested file paths correctly", async () => {
      await upload({
        bucket: "test-bucket",
        filename: "app_123/_dependencies/config.json",
        body,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "app_123/_dependencies/config.json",
          Body: body,
          ContentType: "application/json",
        },
      })
    })

    it("should handle files with multiple dots", async () => {
      await upload({
        bucket: "test-bucket",
        filename: "config.backup.json",
        body,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "config.backup.json",
          Body: body,
          ContentType: "application/json",
        },
      })
    })
  })

  describe("streamUpload", () => {
    const mockStream = new PassThrough()

    it("should upload with application/javascript for .js files", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "budibase-client.js",
        stream: mockStream,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "budibase-client.js",
          Body: mockStream,
          ContentType: "application/javascript",
        },
      })
    })

    it("should upload with application/json for .json files", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "manifest.json",
        stream: mockStream,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "manifest.json",
          Body: mockStream,
          ContentType: "application/json",
        },
      })
    })

    it("should upload with image for .svg files", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "icon.svg",
        stream: mockStream,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "icon.svg",
          Body: mockStream,
          ContentType: "image/svg+xml",
        },
      })
    })

    it("should not override explicit ContentType in extra params", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "manifest.json",
        stream: mockStream,
        extra: {
          ContentType: "application/custom",
        },
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "manifest.json",
          Body: mockStream,
          ContentType: "application/custom",
        },
      })
    })

    it("should preserve other extra params while adding ContentType", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "data.json",
        stream: mockStream,
        extra: {
          CacheControl: "max-age=3600",
          Metadata: {
            customKey: "customValue",
          },
        },
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "data.json",
          Body: mockStream,
          ContentType: "application/json",
          CacheControl: "max-age=3600",
          Metadata: {
            customKey: "customValue",
          },
        },
      })
    })

    it("should not add ContentType for unsupported extensions", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "file.unknown",
        stream: mockStream,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "file.unknown",
          Body: mockStream,
          ContentType: undefined,
        },
      })
    })

    it("should handle nested file paths correctly", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "app_123/_dependencies/config.json",
        stream: mockStream,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "app_123/_dependencies/config.json",
          Body: mockStream,
          ContentType: "application/json",
        },
      })
    })

    it("should handle files with multiple dots", async () => {
      await streamUpload({
        bucket: "test-bucket",
        filename: "config.backup.json",
        stream: mockStream,
      })

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: "test-bucket",
          Key: "config.backup.json",
          Body: mockStream,
          ContentType: "application/json",
        },
      })
    })
  })
})
