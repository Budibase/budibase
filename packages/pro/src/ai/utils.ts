import { SupportedFileType } from "@budibase/types"

// tool names must align with regex "^[a-zA-Z0-9_-]+$"
export function sanitiseToolName(name: string) {
  if (name.length > 64) {
    throw new Error("Tool name must be under 64 characters long")
  }
  return name.replace(/[^a-zA-Z0-9_-]/g, "_")
}

export function normalizeContentType(contentType?: string): string {
  if (!contentType) {
    return "application/octet-stream"
  }

  // If it's already a proper MIME type, return it
  if (contentType.includes("/")) {
    return contentType
  }

  // Map SupportedFileType values to proper MIME types
  const mimeTypeMap: Record<string, string> = {
    [SupportedFileType.PDF]: "application/pdf",
    [SupportedFileType.JPG]: "image/jpeg",
    [SupportedFileType.JPEG]: "image/jpeg",
    [SupportedFileType.PNG]: "image/png",
  }

  return mimeTypeMap[contentType.toLowerCase()] || "application/octet-stream"
}
