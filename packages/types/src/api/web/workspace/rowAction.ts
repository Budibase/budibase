import type { ProjectAssignmentResponse } from "./project"
interface RowActionData {
  name: string
}
interface RowActionPermissionsData {
  allowedSources: string[] | undefined
}
export interface CreateRowActionRequest extends RowActionData {}

export interface RowActionResponse
  extends RowActionData,
    RowActionPermissionsData,
    ProjectAssignmentResponse {
  id: string
  tableId: string
  automationId: string
}

export interface RowActionsResponse {
  actions: Record<string, RowActionResponse>
}

export interface RowActionTriggerRequest {
  rowId: string
}
export interface RowActionTriggerResponse {
  message: string
}

export interface RowActionPermissionsResponse
  extends RowActionPermissionsData {}
