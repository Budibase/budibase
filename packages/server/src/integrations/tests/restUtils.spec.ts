import { getAttachmentHeaders } from "../utils/restUtils"
import type { Headers } from "node-fetch"

function headers(dispositionValue: string, contentType?: string) {
  return {
    get: (name: string) => {
      if (name.toLowerCase() === "content-disposition") {
        return dispositionValue
      } else {
        return contentType || "application/pdf"
      }
    },
    set: () => {},
  } as unknown as Headers
}

describe("getAttachmentHeaders", () => {
  it("should be able to correctly handle a broken content-disposition", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers(`filename="report.pdf"`)
    )
    expect(contentDisposition).toBe(`attachment; filename="report.pdf"`)
  })

  it("should be able to correctly with a filename that could cause problems", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers(`filename="report;.pdf"`)
    )
    expect(contentDisposition).toBe(`attachment; filename="report;.pdf"`)
  })

  it("should not touch a valid content-disposition", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers(`inline; filename="report.pdf"`)
    )
    expect(contentDisposition).toBe(`inline; filename="report.pdf"`)
  })

  it("should handle an image", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers("", "image/png"),
      {
        downloadImages: true,
      }
    )
    expect(contentDisposition).toBe(`attachment; filename="image.png"`)
  })
})
