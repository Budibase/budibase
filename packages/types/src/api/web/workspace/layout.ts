import { Layout } from "../../../documents"

export interface SaveLayoutRequest extends Layout {}

export interface SaveLayoutResponse extends Layout {}

export interface DeleteLayoutResponse {
  message: string
}
