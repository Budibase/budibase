import { BaseEvent } from "./event"

export interface AIConfigCreatedEvent extends BaseEvent {
  configId: string
  audited: {
    name: string
  }
}

export interface AIConfigUpdatedEvent extends BaseEvent {
  configId: string
  audited: {
    name: string
  }
}

export interface AIConfigDeletedEvent extends BaseEvent {
  configId: string
  audited: {
    name: string
  }
}

export interface AIAgentCreatedEvent extends BaseEvent {
  agentId: string
  audited: {
    name: string
  }
}

export interface AIAgentUpdatedEvent extends BaseEvent {
  agentId: string
  audited: {
    name: string
  }
}

export interface AIAgentDeletedEvent extends BaseEvent {
  agentId: string
  audited: {
    name: string
  }
}

export interface RagFileUploadedEvent extends BaseEvent {
  knowledgeBaseId: string
  fileId: string
  sourceType?: string
}

export interface RagFileDeletedEvent extends BaseEvent {
  knowledgeBaseId: string
  fileId: string
  sourceType?: string
}

export interface RagFileSharePointConnectedEvent extends BaseEvent {
  agentId: string
  siteId: string
  sourceId: string
}

export interface RagFileSharePointDisconnectedEvent extends BaseEvent {
  agentId: string
  siteId: string
  sourceId: string
}

export interface RagFileSharePointSyncEvent extends BaseEvent {
  agentId: string
  siteId: string
  sourceId: string
  synced: number
  failed: number
  skipped: number
  alreadySynced: number
  retried: number
  unsupported: number
  filteredOut: number
  deleted: number
  deleteFailed: number
  totalDiscovered: number
  status: string
}

export interface RagFileProcessedEvent extends BaseEvent {
  knowledgeBaseId: string
  fileId: string
  sourceType?: string
  processor: string
}
