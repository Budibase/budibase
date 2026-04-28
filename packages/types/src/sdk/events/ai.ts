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
