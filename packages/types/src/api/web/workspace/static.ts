import stream from "node:stream"
import { Workspace } from "../../../documents"

interface ServeAppWorkspaceResponse extends Workspace {
  clientLibPath?: string
  clientCacheKey?: string
}

export type ServeAppResponse = string | ServeAppWorkspaceResponse

interface BuilderPreview extends Workspace {
  builderPreview: boolean
}

export type ServeBuilderPreviewResponse = BuilderPreview | string

export type ServeClientLibraryResponse = stream.Readable

export interface GetSignedUploadUrlRequest {
  bucket: string
  componentId: string
  key: string
  screenId: string
}
export interface GetSignedUploadUrlResponse {
  signedUrl?: string
  publicUrl?: string
}
