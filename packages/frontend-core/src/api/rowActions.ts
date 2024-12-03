import {
  RowActionsResponse,
  RowActionResponse,
  CreateRowActionRequest,
  RowActionPermissionsResponse,
  RowActionTriggerRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface RowActionEndpoints {
  fetch: (tableId: string) => Promise<Record<string, RowActionResponse>>
  create: (tableId: string, name: string) => Promise<RowActionResponse>
  delete: (tableId: string, rowActionId: string) => Promise<void>
  enableView: (
    tableId: string,
    rowActionId: string,
    viewId: string
  ) => Promise<RowActionPermissionsResponse>
  disableView: (
    tableId: string,
    rowActionId: string,
    viewId: string
  ) => Promise<RowActionPermissionsResponse>
  trigger: (
    sourceId: string,
    rowActionId: string,
    rowId: string
  ) => Promise<void>
}

export const buildRowActionEndpoints = (
  API: BaseAPIClient
): RowActionEndpoints => ({
  /**
   * Gets the available row actions for a table.
   * @param tableId the ID of the table
   */
  fetch: async tableId => {
    return (
      await API.get<RowActionsResponse>({
        url: `/api/tables/${tableId}/actions`,
      })
    ).actions
  },

  /**
   * Creates a row action.
   * @param name the name of the row action
   * @param tableId the ID of the table
   */
  create: async (tableId, name) => {
    return await API.post<CreateRowActionRequest, RowActionResponse>({
      url: `/api/tables/${tableId}/actions`,
      body: {
        name,
      },
    })
  },

  /**
   * Deletes a row action.
   * @param tableId the ID of the table
   * @param rowActionId the ID of the row action to delete
   */
  delete: async (tableId, rowActionId) => {
    return await API.delete({
      url: `/api/tables/${tableId}/actions/${rowActionId}`,
    })
  },

  /**
   * Enables a row action for a certain view
   * @param tableId the ID of the parent table
   * @param rowActionId the ID of the row action
   * @param viewId the ID of the view
   */
  enableView: async (tableId, rowActionId, viewId) => {
    return await API.post({
      url: `/api/tables/${tableId}/actions/${rowActionId}/permissions/${viewId}`,
    })
  },

  /**
   * Disables a row action for a certain view
   * @param tableId the ID of the parent table
   * @param rowActionId the ID of the row action
   * @param viewId the ID of the view
   */
  disableView: async (tableId, rowActionId, viewId) => {
    return await API.delete({
      url: `/api/tables/${tableId}/actions/${rowActionId}/permissions/${viewId}`,
    })
  },

  /**
   * Triggers a row action.
   * @param tableId the ID of the table
   * @param rowActionId the ID of the row action to trigger
   */
  trigger: async (sourceId, rowActionId, rowId) => {
    return await API.post<RowActionTriggerRequest>({
      url: `/api/tables/${sourceId}/actions/${rowActionId}/trigger`,
      body: {
        rowId,
      },
    })
  },
})
