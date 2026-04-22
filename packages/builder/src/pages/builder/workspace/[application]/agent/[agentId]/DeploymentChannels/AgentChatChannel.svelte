<script lang="ts">
  import { ActionButton, Body, Toggle, notifications } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"
  import type { ConversationStarter } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { confirm } from "@/helpers"
  import { appStore, deploymentStore } from "@/stores/builder"
  import { chatAppsStore, currentChatApp } from "@/stores/portal"
  import AgentSettingsModal from "../../../chat/_components/AgentSettingsModal.svelte"

  const CHAT_UPDATE_ERROR_MESSAGE = "Could not update chat"
  const CHAT_LOAD_ERROR_MESSAGE = "Failed to load agent chat status"
  const AGENT_CHAT_ENABLED_MESSAGE = "Agent chat enabled"
  const AGENT_CHAT_DISABLED_MESSAGE = "Agent chat disabled"
  const AGENT_CHAT_ENABLE_ERROR_MESSAGE = "Failed to enable agent chat"
  const AGENT_CHAT_DISABLE_ERROR_MESSAGE = "Failed to disable agent chat"
  const AGENT_CHAT_SETTINGS_SAVED_MESSAGE = "Agent chat settings saved"
  const AGENT_CHAT_SETTINGS_PUBLISHED_MESSAGE =
    "Agent chat settings saved and published"
  const AGENT_CHAT_SETTINGS_SAVE_ERROR_MESSAGE =
    "Failed to save agent chat settings"
  const AGENT_CHAT_DEPRECATION_TITLE = "Agent Chat is deprecated"
  const AGENT_CHAT_DEPRECATION_MESSAGE =
    "Agent Chat will be removed in a future release. We recommend deploying your agent to Slack, Microsoft Teams, or Discord instead."

  export let agentId: string
  export let agentName: string
  export let agentLive: boolean

  let toggling = false
  let loadingChatApp = false
  let attemptedWorkspaceId: string | undefined
  let currentWorkspaceId: string | undefined
  let settingsOpen = false

  interface ChatAppAgentConfig {
    agentId: string
    isEnabled?: boolean
  }

  const isAgentEnabledInChat = (
    chatAppAgents: ChatAppAgentConfig[],
    targetAgentId: string
  ) => {
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
    workspaceId,
    toggling,
  }: {
    workspaceId?: string
    toggling: boolean
  }) => Boolean(workspaceId && !toggling)

  $: workspaceId = $params.application
  $: selectedAgent = { agentId, name: agentName }
  $: currentChatAgents = $currentChatApp?.agents || []
  $: selectedAgentConfig = currentChatAgents.find(
    config => config.agentId === agentId
  )
  $: defaultAgentId = currentChatAgents.find(
    config => config.isEnabled && config.isDefault
  )?.agentId
  $: enabled = isAgentEnabledInChat(currentChatAgents, agentId)
  $: disabled = toggling || loadingChatApp || !workspaceId

  $: chatUrl = $appStore.url
    ? `${helpers.appChatUrl($appStore.url)}/agent/${encodeURIComponent(agentId)}`
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
      .catch(_error => {
        notifications.error(CHAT_LOAD_ERROR_MESSAGE)
      })
      .finally(() => {
        loadingChatApp = false
      })
  }

  const publishIfAgentLive = async () => {
    if (!agentLive) {
      return false
    }
    await deploymentStore.publishApp()
    return true
  }

  const onToggle = async () => {
    if (!canToggleAgentChat({ workspaceId, toggling })) {
      return
    }

    const targetWorkspaceId = workspaceId
    if (!targetWorkspaceId) {
      return
    }

    toggling = true
    const wasEnabled = enabled
    try {
      if (!wasEnabled) {
        const shouldEnable = await confirm({
          title: AGENT_CHAT_DEPRECATION_TITLE,
          body: AGENT_CHAT_DEPRECATION_MESSAGE,
          okText: "Enable anyway",
          cancelText: "Cancel",
          warning: true,
        })
        if (!shouldEnable) {
          return
        }
      }

      const result = await chatAppsStore.toggleAgentDeploymentInChat(
        agentId,
        targetWorkspaceId
      )
      if (!result) {
        notifications.error(CHAT_UPDATE_ERROR_MESSAGE)
        return
      }

      await publishIfAgentLive()
      notifications.success(
        result.enabled
          ? AGENT_CHAT_ENABLED_MESSAGE
          : AGENT_CHAT_DISABLED_MESSAGE
      )
    } catch (error) {
      notifications.error(
        wasEnabled
          ? AGENT_CHAT_DISABLE_ERROR_MESSAGE
          : AGENT_CHAT_ENABLE_ERROR_MESSAGE
      )
    } finally {
      toggling = false
    }
  }

  const handleUpdateConversationStarters = async (
    targetAgentId: string,
    starters: ConversationStarter[]
  ) => {
    if (!workspaceId || !targetAgentId) {
      return
    }

    try {
      const updated = await chatAppsStore.upsertAgentConfig({
        agentId: targetAgentId,
        updates: {
          conversationStarters: starters,
        },
        workspaceId,
      })
      if (!updated) {
        notifications.error(CHAT_UPDATE_ERROR_MESSAGE)
        return
      }
      const published = await publishIfAgentLive()
      notifications.success(
        published
          ? AGENT_CHAT_SETTINGS_PUBLISHED_MESSAGE
          : AGENT_CHAT_SETTINGS_SAVED_MESSAGE
      )
    } catch (error) {
      notifications.error(AGENT_CHAT_SETTINGS_SAVE_ERROR_MESSAGE)
    }
  }

  const handleUpdateAccessRole = async (
    targetAgentId: string,
    roleId?: string
  ) => {
    if (!workspaceId || !targetAgentId) {
      return
    }

    try {
      const updated = await chatAppsStore.upsertAgentConfig({
        agentId: targetAgentId,
        updates: {
          roleId,
        },
        workspaceId,
      })
      if (!updated) {
        notifications.error(CHAT_UPDATE_ERROR_MESSAGE)
        return
      }
      const published = await publishIfAgentLive()
      notifications.success(
        published
          ? AGENT_CHAT_SETTINGS_PUBLISHED_MESSAGE
          : AGENT_CHAT_SETTINGS_SAVED_MESSAGE
      )
    } catch (error) {
      notifications.error(AGENT_CHAT_SETTINGS_SAVE_ERROR_MESSAGE)
    }
  }
</script>

<div class="integration-row">
  <div class="channel-main">
    <div class="logo-placeholder" aria-hidden="true" />
    <div class="channel-details">
      <Body color={"var(--spectrum-global-color-gray-900)"} size="XS"
        >Agent Chat</Body
      >
      <Body color={"var(--spectrum-global-color-orange-900)"} size="XS"
        >Deprecated: Agent Chat will be removed in a future release.</Body
      >
    </div>
  </div>
  <div class="row-action">
    {#if enabled && chatUrl}
      <a class="chat-link" href={chatUrl} target="_blank" rel="noreferrer">
        Open chat
      </a>
    {/if}
    <ActionButton
      size="S"
      icon="gear"
      accentColor="Blue"
      disabled={loadingChatApp || !workspaceId}
      on:click={() => (settingsOpen = true)}
    >
      Manage
    </ActionButton>
    <Toggle value={enabled} {disabled} on:change={onToggle} />
  </div>
</div>

<AgentSettingsModal
  open={settingsOpen}
  {selectedAgent}
  {selectedAgentConfig}
  {defaultAgentId}
  showDefaultControls={false}
  isAgentAvailable={() => true}
  onUpdateAccessRole={handleUpdateAccessRole}
  onUpdateConversationStarters={handleUpdateConversationStarters}
  onClose={() => {
    settingsOpen = false
  }}
/>

<style>
  .integration-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) var(--spacing-s);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    min-height: 40px;
  }

  .channel-main {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .logo-placeholder {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .channel-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: var(--spacing-m);
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 220px;
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
