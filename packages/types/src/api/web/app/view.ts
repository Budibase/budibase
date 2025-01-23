import { ViewV2 } from "../../../documents"
import { ViewV2Enriched } from "../../../sdk/view"

export interface ViewResponse {
  data: ViewV2
}

export interface ViewResponseEnriched {
  data: ViewV2Enriched
}

export interface ViewFetchResponseEnriched {
  data: ViewV2Enriched[]
}

export interface CreateViewRequest extends Omit<ViewV2, "version" | "id"> {}
export interface CreateViewResponse extends ViewResponse {}

export interface UpdateViewRequest extends ViewV2 {}
export interface UpdateViewResponse extends ViewResponse {}
