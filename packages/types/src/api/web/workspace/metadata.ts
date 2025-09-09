import { MetadataType, Document } from "../../../documents"

export interface GetMetadataTypesResponse {
  types: typeof MetadataType
}

export interface SaveMetadataRequest extends Document {}
export interface SaveMetadataResponse extends Document {}

export interface DeleteMetadataResponse {
  message: string
}

export interface FindMetadataResponse extends Document {}
