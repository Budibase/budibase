import { ScreenRoutingJson, Screen, SourceType } from "../../../documents"

export interface FetchScreenRoutingResponse {
  routes: ScreenRoutingJson
}

export interface FetchClientScreenRoutingResponse
  extends FetchScreenRoutingResponse {}

export type FetchScreenResponse = Screen[]

export interface SaveScreenRequest extends Screen {
  navigationLinkLabel?: string
}
export interface SaveScreenResponse extends Screen {}

export interface DeleteScreenResponse {
  message: string
}

export interface ScreenUsage {
  url: string
  _id: string
  workspaceAppId: string
}

export interface UsageInScreensResponse {
  sourceType: SourceType
  screens: ScreenUsage[]
}
