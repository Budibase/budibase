export interface BuilderMetadata {
  selectedResourceId?: string
}

export interface SocketSession {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  sessionId: string
  room?: string
  connectedAt: number
  builderMetadata?: BuilderMetadata
}
