import { App } from "../../../documents"
import stream from "node:stream"

export type ServeAppResponse = string

interface BuilderPreview extends App {
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
