// Import after mocks

import { Upload } from "@aws-sdk/lib-storage"
import { PassThrough } from "stream"
import { streamUpload } from "../objectStore"

// Get mock instances
const mockUpload = Upload as jest.MockedClass<typeof Upload>

describe("objectStore - streamUpload content type handling (real function)", () => {
  const mockStream = new PassThrough()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("actual streamUpload function with content type inference", () => {
    it("should call Upload with application/javascript for .js files", async () => {
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

    it("should call Upload with application/json for .json files", async () => {
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

    it("should call Upload with image for .svg files", async () => {
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
