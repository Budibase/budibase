<script lang="ts">
  import { Button, notifications } from "@budibase/bbui"
  import TopBar from "@/components/common/TopBar.svelte"
  import {
    agentsStore,
    chatAppsStore,
    currentChatApp,
    featureFlags,
  } from "@/stores/portal"
  import { deploymentStore, themeStore } from "@/stores/builder"
  import { FeatureFlag } from "@budibase/types"
  import type { Theme } from "@budibase/types"
  import { ensureValidTheme } from "@budibase/shared-core"
  import { goto as gotoStore, params } from "@roxi/routify"
  import { onMount } from "svelte"

  import ChatApp from "./_components/ChatApp.svelte"
  import ChatSettingsPanel from "./_components/ChatSettingsPanel.svelte"

  type ChatAgentConfig = {
    agentId: string
    isEnabled: boolean
    isDefault: boolean
    conversationStarters?: { prompt: string }[]
  }

  $: goto = $gotoStore

  let chatAgents: ChatAgentConfig[] = []
  let settingChatLive = false
  let settingChatTheme = false

  $: chatEnabled =
    $featureFlags[FeatureFlag.AI_AGENTS] && $featureFlags[FeatureFlag.AI_CHAT]

  onMount(() => {
    if (chatEnabled) {
      return
    }

    const workspaceHomeEnabled = $featureFlags[FeatureFlag.WORKSPACE_HOME]
    const agentsEnabled = $featureFlags[FeatureFlag.AI_AGENTS]

    if (workspaceHomeEnabled) {
      goto(agentsEnabled ? "../home?type=agent" : "../home")
      return
    }

    goto(agentsEnabled ? "../agent" : "../")
  })

  $: namedAgents = agents.filter(agent => Boolean(agent?.name))
  $: chatApp = $currentChatApp
  $: chatAgents = (chatApp?.agents || []) as ChatAgentConfig[]
  $: selectedChatTheme = ensureValidTheme(
    chatApp?.theme as Theme | undefined,
    $themeStore.theme
  )

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

  const toggleChatLive = async () => {
    const workspaceId = $params.application
    if (!workspaceId || settingChatLive) {
      return
    }

    settingChatLive = true
    let nextLive: boolean | undefined

    try {
      const ensured = await chatAppsStore.ensureChatApp(undefined, workspaceId)
      if (!ensured) {
        notifications.error("Could not update chat")
        return
      }

      nextLive = !ensured.live
      await chatAppsStore.updateChatApp({ live: nextLive })
      await deploymentStore.publishApp()
      notifications.success(
        nextLive ? "Chat is now live" : "Chat has been paused"
      )
    } catch (error) {
      console.error(error)
      if (nextLive === false) {
        notifications.error("Error pausing chat")
      } else if (nextLive === true) {
        notifications.error("Error setting chat live")
      } else {
        notifications.error("Error updating chat")
      }
    } finally {
      settingChatLive = false
    }
  }

  const handleThemeChange = async (theme: Theme) => {
    const workspaceId = $params.application
    if (!workspaceId || settingChatTheme || theme === selectedChatTheme) {
      return
    }

    settingChatTheme = true
    try {
      const ensured = await chatAppsStore.ensureChatApp(undefined, workspaceId)
      if (!ensured) {
        notifications.error("Could not update chat theme")
        return
      }

      await chatAppsStore.updateChatApp({ theme })
    } catch (error) {
      console.error(error)
      notifications.error("Error updating chat theme")
    } finally {
      settingChatTheme = false
    }
  }
</script>

<div class="wrapper">
  <TopBar breadcrumbs={[{ text: "Chat" }]} icon="chat" showPublish={false}>
    <Button
      primary={!chatApp?.live}
      secondary={chatApp?.live}
      icon={chatApp?.live ? undefined : "play"}
      iconColor={chatApp?.live ? "" : "var(--bb-blue)"}
      iconWeight="fill"
      on:click={toggleChatLive}
      disabled={settingChatLive}
      >{chatApp?.live ? "Pause chat" : "Set your chat live"}</Button
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
      selectedTheme={selectedChatTheme}
      {handleThemeChange}
      {handleUpdateConversationStarters}
    />

    {#if $params.application}
      <div class="chat-app-container">
        <ChatApp workspaceId={$params.application} theme={selectedChatTheme} />
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
