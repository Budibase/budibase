import { FetchEnrichedRowResponse, Row } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface RelationshipEndpoints {
  fetchRelationshipData: (
    sourceId: string,
    rowId: string,
    fieldName?: string
  ) => Promise<Row[]>
}

export const buildRelationshipEndpoints = (
  API: BaseAPIClient
): RelationshipEndpoints => ({
  /**
   * Fetches related rows for a certain field of a certain row.
   * @param sourceId the ID of the table to fetch from
   * @param rowId the ID of the row to fetch related rows for
   * @param fieldName the name of the relationship field
   */
  fetchRelationshipData: async (sourceId, rowId, fieldName) => {
    const response = await API.get<FetchEnrichedRowResponse>({
      url: `/api/${sourceId}/${rowId}/enrich?field=${fieldName}`,
    })
    if (!fieldName) {
      return [response]
    } else {
      return response[fieldName] || []
    }
  },
})
