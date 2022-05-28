export interface BuilderServedEvent {}

export interface AppServedEvent {
  appId: string
  appVersion: string
}

export interface AppPreviewServedEvent {
  appId: string
  appVersion: string
}
