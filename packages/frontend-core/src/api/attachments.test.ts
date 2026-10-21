import { describe, expect, it, vi } from "vitest"
import { buildAttachmentEndpoints } from "./attachments"
import type { BaseAPIClient } from "./types"

describe("S3 uploads", () => {
  it("sends the upload context to the signer and uploads the original file", async () => {
    const api: BaseAPIClient = {
      post: vi.fn(),
      put: vi.fn(),
      get: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      invalidateCache: vi.fn(),
      getAppID: vi.fn(),
    }
    const signedUrl = "https://example.com/uploads/file.txt?signature=test"
    const publicUrl = "https://example.com/uploads/file.txt"
    vi.mocked(api.post).mockResolvedValue({ signedUrl, publicUrl })
    const data = new Blob(["uploaded file content"], { type: "text/plain" })

    const result = await buildAttachmentEndpoints(api).externalUpload({
      datasourceId: "datasource_s3",
      bucket: "uploads",
      key: "file.txt",
      componentId: "s3-upload-component",
      screenId: "screen_upload",
      data,
    })

    expect(api.post).toHaveBeenCalledWith({
      url: "/api/attachments/datasource_s3/url",
      body: {
        bucket: "uploads",
        key: "file.txt",
        componentId: "s3-upload-component",
        screenId: "screen_upload",
      },
    })
    expect(api.put).toHaveBeenCalledWith({
      url: signedUrl,
      body: data,
      json: false,
      external: true,
      parseResponse: expect.any(Function),
    })
    expect(result).toEqual({ publicUrl })
  })
})
