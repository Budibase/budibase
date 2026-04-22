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

export default {
  configCreated,
  configUpdated,
  configDeleted,
  agentCreated,
  agentUpdated,
  agentDeleted,
}
