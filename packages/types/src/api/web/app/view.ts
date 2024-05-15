import { ViewV2, ViewV2Enriched } from "../../../documents"

export interface ViewResponse {
  data: ViewV2
}

export interface ViewResponseEnriched {
  data: ViewV2Enriched
}

export interface CreateViewRequest extends Omit<ViewV2, "version" | "id"> {}

export interface UpdateViewRequest extends ViewV2 {}
