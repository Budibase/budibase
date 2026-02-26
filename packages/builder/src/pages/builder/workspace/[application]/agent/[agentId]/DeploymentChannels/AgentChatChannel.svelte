<script lang="ts">
  import { Body, Toggle, notifications } from "@budibase/bbui"
  import { appStore, deploymentStore } from "@/stores/builder"
  import { chatAppsStore, currentChatApp } from "@/stores/portal"
  import { params } from "@roxi/routify"
  import BBAILogo from "assets/bb-ai.svg"

  export let agentId: string | undefined

  let toggling = false
  let loadingChatApp = false
  let attemptedWorkspaceId: string | undefined
  let currentWorkspaceId: string | undefined

  interface ChatAppAgentConfig {
    agentId: string
    isEnabled?: boolean
  }

  const isAgentEnabledInChat = (
    chatAppAgents: ChatAppAgentConfig[],
    targetAgentId?: string
  ) => {
    if (!targetAgentId) {
      return false
    }

    return Boolean(
      chatAppAgents.find(
        agent => agent.agentId === targetAgentId && agent.isEnabled
      )
    )
  }

  const shouldEnsureChatApp = ({
    workspaceId,
    attemptedWorkspaceId,
    hasCurrentChatApp,
    loadingChatApp,
  }: {
    workspaceId?: string
    attemptedWorkspaceId?: string
    hasCurrentChatApp: boolean
    loadingChatApp: boolean
  }) =>
    Boolean(
      workspaceId &&
        workspaceId !== attemptedWorkspaceId &&
        !hasCurrentChatApp &&
        !loadingChatApp
    )

  const canToggleAgentChat = ({
    agentId,
    workspaceId,
    toggling,
  }: {
    agentId?: string
    workspaceId?: string
    toggling: boolean
  }) => Boolean(agentId && workspaceId && !toggling)

  $: workspaceId = $params.application
  $: currentChatAgents = $currentChatApp?.agents || []
  $: enabled = isAgentEnabledInChat(currentChatAgents, agentId)
  $: disabled = toggling || loadingChatApp || !agentId || !workspaceId

  $: chatUrl =
    agentId && $appStore.url
      ? `/app-chat${$appStore.url}/agent/${encodeURIComponent(agentId)}`
      : ""

  $: if (workspaceId !== currentWorkspaceId) {
    currentWorkspaceId = workspaceId
    attemptedWorkspaceId = undefined
  }

  $: if (
    shouldEnsureChatApp({
      workspaceId,
      attemptedWorkspaceId,
      hasCurrentChatApp: Boolean($currentChatApp),
      loadingChatApp,
    })
  ) {
    attemptedWorkspaceId = workspaceId
    loadingChatApp = true
    chatAppsStore
      .ensureChatApp(undefined, workspaceId)
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        loadingChatApp = false
      })
  }

  const onToggle = async () => {
    if (!canToggleAgentChat({ agentId, workspaceId, toggling })) {
      return
    }

    const targetAgentId = agentId
    const targetWorkspaceId = workspaceId
    if (!targetAgentId || !targetWorkspaceId) {
      return
    }

    toggling = true
    const wasEnabled = enabled
    try {
      const result = await chatAppsStore.toggleAgentDeploymentInChat(
        targetAgentId,
        targetWorkspaceId
      )
      if (!result) {
        notifications.error("Could not update chat")
        return
      }

      await deploymentStore.publishApp()
      notifications.success(
        result.enabled ? "Agent chat enabled" : "Agent chat disabled"
      )
    } catch (error) {
      console.error(error)
      notifications.error(
        wasEnabled
          ? "Failed to disable agent chat"
          : "Failed to enable agent chat"
      )
    } finally {
      toggling = false
    }
  }
</script>

<div class="integration-row">
  <div class="channel-main">
    <img alt="Agent Chat" width="22px" height="22px" src={BBAILogo} />
    <div class="channel-details">
      <Body color={"var(--spectrum-global-color-gray-900)"} size="XS"
        >Agent Chat</Body
      >
      <Body color={"var(--spectrum-global-color-gray-700)"} size="XS"
        >An out-of-the-box chat application for AI agents</Body
      >
    </div>
  </div>
  <div class="row-action">
    {#if enabled && chatUrl}
      <a class="chat-link" href={chatUrl} target="_blank" rel="noreferrer">
        Open chat
      </a>
    {/if}
    <Toggle value={enabled} {disabled} on:change={onToggle} />
  </div>
</div>

<style>
  .integration-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) var(--spacing-s);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    height: 40px;
  }

  .channel-main {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .channel-details {
    display: flex;
    flex-direction: column;
    margin-left: var(--spacing-m);
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 150px;
    gap: 10px;
    margin-left: 0px;
  }

  .chat-link {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    text-decoration: none;
  }

  .chat-link:hover {
    color: var(--spectrum-global-color-gray-900);
    text-decoration: underline;
  }
</style>
