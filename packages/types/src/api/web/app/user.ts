import { ContextUserMetadata } from "../../../"

export type FetchUserMetadataResponse = ContextUserMetadata[]
export type FindUserMetadataResponse = ContextUserMetadata

export interface SetFlagRequest {
  flag: string
  value: any
}
