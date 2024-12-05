import { ScreenRoutingJson, Screen } from "../../../documents"

export interface FetchScreenRoutingResponse {
  routes: ScreenRoutingJson
}

export interface FetchClientScreenRoutingResponse
  extends FetchScreenRoutingResponse {}

export type FetchScreenResponse = Screen[]

export interface SaveScreenRequest extends Screen {}
export interface SaveScreenResponse extends Screen {}

export interface DeleteScreenResponse {
  message: string
}
