import { BaseEvent } from "./event"

export interface AIConfigCreatedEvent extends BaseEvent {}

export interface AIConfigUpdatedEvent extends BaseEvent {}

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
