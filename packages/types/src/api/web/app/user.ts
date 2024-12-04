import { ContextUserMetadata, Flags, UserMetadata } from "../../../"
import { DocumentInsertResponse } from "@budibase/nano"

export type FetchUserMetadataResponse = ContextUserMetadata[]
export type FindUserMetadataResponse = ContextUserMetadata

export interface SetUserFlagRequest {
  flag: string
  value: any
}
export interface SetUserFlagResponse {
  message: string
}

export interface GetUserFlagsResponse extends Flags {}

export type AppSelfResponse = ContextUserMetadata | {}

export interface UpdateSelfMetadataRequest extends UserMetadata {}
export interface UpdateSelfMetadataResponse extends DocumentInsertResponse {}

export interface UpdateUserMetadataRequest extends UserMetadata {}
export interface UpdateUserMetadataResponse extends DocumentInsertResponse {}

export interface DeleteUserMetadataResponse {
  message: string
}
