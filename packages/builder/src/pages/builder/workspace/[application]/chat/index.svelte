<script lang="ts">
  import { Button } from "@budibase/bbui"
  import TopBar from "@/components/common/TopBar.svelte"
  import { agentsStore, chatAppsStore, currentChatApp } from "@/stores/portal"
  import { params } from "@roxi/routify"

  import ChatApp from "./_components/ChatApp.svelte"
  import ChatSettingsPanel from "./_components/ChatSettingsPanel.svelte"

  type ChatAgentConfig = {
    agentId: string
    isEnabled: boolean
    isDefault: boolean
    conversationStarters?: { prompt: string }[]
  }

  let chatAgents: ChatAgentConfig[] = []

  $: namedAgents = agents.filter(agent => Boolean(agent?.name))
  $: chatApp = $currentChatApp
  $: chatAgents = (chatApp?.agents || []) as ChatAgentConfig[]

  $: agents = [...$agentsStore.agents].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )

  const isAgentAvailable = (agentId: string) =>
    chatAgents.some(agent => agent.agentId === agentId && agent.isEnabled)

  const handleAvailabilityToggle = async (
    agentId: string,
    enabled: boolean
  ) => {
    const workspaceId = $params.application
    if (!workspaceId || !agentId) {
      return
    }

    if (enabled && isAgentAvailable(agentId)) {
      return
    }

    if (!enabled && !isAgentAvailable(agentId)) {
      return
    }

    await chatAppsStore.ensureChatApp(undefined, workspaceId)

    const current = chatAgents
    const existing = current.find(agent => agent.agentId === agentId)
    const nextAgents: ChatAgentConfig[] = enabled
      ? [
          ...current.filter(agent => agent.agentId !== agentId),
          {
            agentId,
            isEnabled: true,
            isDefault: existing?.isDefault ?? false,
          },
        ]
      : current.map(agent =>
          agent.agentId === agentId
            ? { ...agent, isEnabled: false, isDefault: false }
            : agent
        )

    if (!enabled && $agentsStore.currentAgentId === agentId) {
      const fallbackAgentId = nextAgents.find(agent => agent.isEnabled)?.agentId
      await agentsStore.selectAgent(fallbackAgentId)
    }

    await chatAppsStore.updateAgents(nextAgents)
  }

  const handleDefaultToggle = async (agentId: string) => {
    const workspaceId = $params.application
    if (!workspaceId || !agentId) {
      return
    }

    await chatAppsStore.ensureChatApp(undefined, workspaceId)

    const current = chatAgents
    const hasAgent = current.some(agent => agent.agentId === agentId)
    const baseAgents = hasAgent
      ? current
      : [...current, { agentId, isEnabled: true, isDefault: false }]

    const nextAgents: ChatAgentConfig[] = baseAgents.map(agent => ({
      ...agent,
      isDefault: agent.agentId === agentId,
      isEnabled: agent.agentId === agentId ? true : agent.isEnabled,
    }))

    await chatAppsStore.updateAgents(nextAgents)
  }

  const handleAddAgent = async (agentId: string) => {
    const workspaceId = $params.application
    if (!workspaceId || !agentId) {
      return
    }

    await chatAppsStore.ensureChatApp(agentId, workspaceId)
  }

  const handleUpdateConversationStarters = async (
    agentId: string,
    starters: { prompt: string }[]
  ) => {
    const workspaceId = $params.application
    if (!workspaceId || !agentId) {
      return
    }

    await chatAppsStore.ensureChatApp(undefined, workspaceId)

    const current = chatAgents
    const hasAgent = current.some(agent => agent.agentId === agentId)
    if (!hasAgent) {
      return
    }

    const nextAgents: ChatAgentConfig[] = current.map(agent =>
      agent.agentId === agentId
        ? { ...agent, conversationStarters: starters }
        : agent
    )

    await chatAppsStore.updateAgents(nextAgents)
  }
</script>

<div class="wrapper">
  <TopBar breadcrumbs={[{ text: "Chat" }]} icon="chat" showPublish={false}>
    <Button
      primary
      icon="play"
      iconColor="var(--bb-blue)"
      iconWeight="fill"
      >Set your chat live</Button
    >
  </TopBar>
  <div class="page">
    <ChatSettingsPanel
      {namedAgents}
      agents={chatAgents}
      {isAgentAvailable}
      {handleAvailabilityToggle}
      {handleDefaultToggle}
      {handleAddAgent}
      {handleUpdateConversationStarters}
    />

    {#if $params.application}
      <div class="chat-app-container">
        <ChatApp workspaceId={$params.application} />
      </div>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
  }

  .page {
    flex: 1 1 auto;
    display: flex;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    flex-direction: row;
    height: 0;
    width: 100%;
    align-items: stretch;
  }

  .chat-app-container {
    flex: 1 1 auto;
    display: flex;
    margin: var(--spacing-xl);
    border-radius: 24px;
    border: var(--border-light);
    background: transparent;
    overflow: hidden;
    min-width: 0;
  }
</style>
