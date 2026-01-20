<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import { agentsStore, chatAppsStore, currentChatApp } from "@/stores/portal"
  import { notifications } from "@budibase/bbui"
  import { params } from "@roxi/routify"

  import ChatApp from "./_components/ChatApp.svelte"
  import ChatSettingsPanel from "./_components/ChatSettingsPanel.svelte"

  type EnabledAgent = { agentId: string; default?: boolean }

  $: namedAgents = agents.filter(agent => Boolean(agent?.name))
  $: chatApp = $currentChatApp
  $: enabledAgents = chatApp?.enabledAgents || []

  $: agents = [...$agentsStore.agents].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )

  const isAgentAvailable = (agentId: string) =>
    enabledAgents.some((agent: EnabledAgent) => agent.agentId === agentId)

  const handleAvailabilityToggle = async (
    agentId: string,
    enabled: boolean
  ) => {
    const workspaceId = $params.application
    if (!workspaceId) {
      return
    }

    if (!agentId) {
      return
    }

    if (enabled && isAgentAvailable(agentId)) {
      return
    }

    if (!enabled && !isAgentAvailable(agentId)) {
      return
    }

    // Ensure we have a chat app loaded before updating enabled agents
    await chatAppsStore.ensureChatApp(undefined, workspaceId)

    const current = enabledAgents
    let nextEnabledAgents: EnabledAgent[] = []

    if (enabled) {
      nextEnabledAgents = [...current, { agentId }]
    } else {
      nextEnabledAgents = current.filter(agent => agent.agentId !== agentId)
      if (!nextEnabledAgents.length) {
        notifications.error("At least one agent must remain enabled")
        return
      }

      if ($agentsStore.currentAgentId === agentId) {
        const fallbackAgentId = nextEnabledAgents[0]?.agentId
        await agentsStore.selectAgent(fallbackAgentId)
      }
    }

    await chatAppsStore.updateEnabledAgents(nextEnabledAgents)
  }

  const handleDefaultToggle = async (agentId: string) => {
    const workspaceId = $params.application
    if (!workspaceId) {
      return
    }

    if (!agentId || !isAgentAvailable(agentId)) {
      return
    }

    // Ensure we have a chat app loaded before updating enabled agents
    await chatAppsStore.ensureChatApp(undefined, workspaceId)

    const current = enabledAgents
    const hasAgent = current.some(agent => agent.agentId === agentId)
    const baseAgents = hasAgent ? current : [...current, { agentId }]

    const nextEnabledAgents = baseAgents.map(agent => ({
      agentId: agent.agentId,
      default: agent.agentId === agentId,
    }))

    await chatAppsStore.updateEnabledAgents(nextEnabledAgents)
  }
</script>

<div class="wrapper">
  <TopBar breadcrumbs={[{ text: "Chat" }]} icon="chat" showPublish={false} />
  <div class="page">
    <ChatSettingsPanel
      {namedAgents}
      {enabledAgents}
      {isAgentAvailable}
      {handleAvailabilityToggle}
      {handleDefaultToggle}
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
