export enum EventPublishType {
  ENVIRONMENT_VARIABLE_UPGRADE_PANEL_OPENED = "environment_variable_upgrade_panel_opened",
}

export interface PostEventPublishRequest {
  type: EventPublishType
}
export interface PostEventPublishResponse {
  message: string
}
