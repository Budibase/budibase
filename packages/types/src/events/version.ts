export interface VersionCheckedEvent {
  currentVersion: string
}

export interface VersionChangeEvent {
  from: string
  to: string
}
