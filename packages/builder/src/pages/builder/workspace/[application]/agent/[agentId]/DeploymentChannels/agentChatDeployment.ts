import type { ChatApp } from "@budibase/types"

type ChatAppAgent = NonNullable<ChatApp["agents"]>[number]

interface BuildAgentChatUpdateInput {
  agents: ChatAppAgent[]
  agentId: string
  enable: boolean
}

interface BuildAgentChatUpdateResult {
  agents: ChatAppAgent[]
  live?: true
}

const pickDefaultEnabledAgentId = (agents: ChatAppAgent[]) => {
  const existingDefault = agents.find(
    agent => agent.isEnabled && agent.isDefault
  )
  if (existingDefault) {
    return existingDefault.agentId
  }

  return agents.find(agent => agent.isEnabled)?.agentId
}

const normalizeDefaultAgent = (agents: ChatAppAgent[]) => {
  const defaultAgentId = pickDefaultEnabledAgentId(agents)
  return agents.map(agent => ({
    ...agent,
    isDefault: !!defaultAgentId && agent.agentId === defaultAgentId,
  }))
}

export const buildAgentChatUpdate = ({
  agents,
  agentId,
  enable,
}: BuildAgentChatUpdateInput): BuildAgentChatUpdateResult => {
  if (enable) {
    const existingEntry = agents.find(agent => agent.agentId === agentId)
    const nextAgents = normalizeDefaultAgent(
      existingEntry
        ? agents.map(agent =>
            agent.agentId === agentId
              ? {
                  ...agent,
                  isEnabled: true,
                }
              : agent
          )
        : [
            ...agents,
            {
              agentId,
              isEnabled: true,
              isDefault: false,
            },
          ]
    )

    return {
      agents: nextAgents,
      live: true,
    }
  }

  return {
    agents: normalizeDefaultAgent(
      agents.map(agent =>
        agent.agentId === agentId
          ? {
              ...agent,
              isEnabled: false,
              isDefault: false,
            }
          : agent
      )
    ),
  }
}
