import { publishEvent } from "../events"
import {
  Agent,
  CustomAIProviderConfig,
  Event,
  AIConfigCreatedEvent,
  AIConfigUpdatedEvent,
  AIConfigDeletedEvent,
  AIAgentCreatedEvent,
  AIAgentUpdatedEvent,
  AIAgentDeletedEvent,
  RagFileUploadedEvent,
  RagFileDeletedEvent,
  RagFileSharePointConnectedEvent,
  RagFileSharePointDisconnectedEvent,
  RagFileSharePointSyncEvent,
  RagFileProcessedEvent,
} from "@budibase/types"

function configCreated(
  config: CustomAIProviderConfig,
  timestamp?: string | number
) {
  const properties: AIConfigCreatedEvent = {
    configId: config._id as string,
    audited: { name: config.name },
  }
  publishEvent(Event.AI_CONFIG_CREATED, properties, timestamp).catch(err => {
    console.error("configCreated telemetry failed", {
      configId: config._id,
      err,
    })
  })
}

function configUpdated(config: CustomAIProviderConfig) {
  const properties: AIConfigUpdatedEvent = {
    configId: config._id as string,
    audited: { name: config.name },
  }
  publishEvent(Event.AI_CONFIG_UPDATED, properties).catch(err => {
    console.error("configUpdated telemetry failed", {
      configId: config._id,
      err,
    })
  })
}

function configDeleted(config: CustomAIProviderConfig) {
  const properties: AIConfigDeletedEvent = {
    configId: config._id as string,
    audited: { name: config.name },
  }
  publishEvent(Event.AI_CONFIG_DELETED, properties).catch(err => {
    console.error("configDeleted telemetry failed", {
      configId: config._id,
      err,
    })
  })
}

function agentCreated(agent: Agent) {
  const properties: AIAgentCreatedEvent = {
    agentId: agent._id as string,
    audited: { name: agent.name },
  }
  publishEvent(Event.AI_AGENT_CREATED, properties).catch(err => {
    console.error("agentCreated telemetry failed", { agentId: agent._id, err })
  })
}

function agentUpdated(agent: Agent) {
  const properties: AIAgentUpdatedEvent = {
    agentId: agent._id as string,
    audited: { name: agent.name },
  }
  publishEvent(Event.AI_AGENT_UPDATED, properties).catch(err => {
    console.error("agentUpdated telemetry failed", { agentId: agent._id, err })
  })
}

function agentDeleted(agent: Agent) {
  const properties: AIAgentDeletedEvent = {
    agentId: agent._id as string,
    audited: { name: agent.name },
  }
  publishEvent(Event.AI_AGENT_DELETED, properties).catch(err => {
    console.error("agentDeleted telemetry failed", { agentId: agent._id, err })
  })
}

function ragFileUploaded(event: RagFileUploadedEvent) {
  publishEvent(Event.RAG_FILE_UPLOADED, event).catch(err => {
    console.error("ragFileUploaded telemetry failed", { event, err })
  })
}

function ragFileDeleted(event: RagFileDeletedEvent) {
  publishEvent(Event.RAG_FILE_DELETED, event).catch(err => {
    console.error("ragFileDeleted telemetry failed", { event, err })
  })
}

function ragFileSharePointConnected(event: RagFileSharePointConnectedEvent) {
  publishEvent(Event.RAG_FILE_SHAREPOINT_CONNECTED, event).catch(err => {
    console.error("ragFileSharePointConnected telemetry failed", {
      event,
      err,
    })
  })
}

function ragFileSharePointDisconnected(
  event: RagFileSharePointDisconnectedEvent
) {
  publishEvent(Event.RAG_FILE_SHAREPOINT_DISCONNECTED, event).catch(err => {
    console.error("ragFileSharePointDisconnected telemetry failed", {
      event,
      err,
    })
  })
}

function ragFileProcessed(event: RagFileProcessedEvent) {
  publishEvent(Event.RAG_FILE_PROCESSED, event).catch(err => {
    console.error("ragFileProcessed telemetry failed", { event, err })
  })
}

function ragFileSharePointSync(event: RagFileSharePointSyncEvent) {
  publishEvent(Event.RAG_FILE_SHAREPOINT_SYNC, event).catch(err => {
    console.error("ragFileSharePointSync telemetry failed", { event, err })
  })
}

export default {
  configCreated,
  configUpdated,
  configDeleted,
  agentCreated,
  agentUpdated,
  agentDeleted,
  ragFileUploaded,
  ragFileDeleted,
  ragFileSharePointConnected,
  ragFileSharePointDisconnected,
  ragFileSharePointSync,
  ragFileProcessed,
}
