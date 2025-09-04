import stream from "node:stream"
import { Workspace } from "../../../documents"

export type ServeAppResponse = string | Workspace

interface BuilderPreview extends Workspace {
  builderPreview: boolean
}

export type ServeBuilderPreviewResponse = BuilderPreview | string

export type ServeClientLibraryResponse = stream.Readable

export interface GetSignedUploadUrlRequest {
  bucket: string
  key: string
}
export interface GetSignedUploadUrlResponse {
  signedUrl?: string
  publicUrl?: string
}
