import { ScreenRoutingJson } from "../../../documents"

export interface FetchScreenRoutingResponse {
  routes: ScreenRoutingJson
}

export interface FetchClientScreenRoutingResponse
  extends FetchScreenRoutingResponse {}
