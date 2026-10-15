<script lang="ts">
  import {
    type AgentMessageMetadata,
    type DraftChatConversation,
    type WithoutDocMetadata,
  } from "@budibase/types"
  import type { UIMessage } from "ai"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import { Constants } from "@budibase/frontend-core"
  import { Select } from "@budibase/bbui"
  import { escalationsStore } from "@/stores/portal/escalations"
  import { auth } from "@/stores/portal"
  import { roles } from "@/stores/builder"
  import { onMount } from "svelte"
  import {
    loadPromptHistory,
    savePromptHistory,
  } from "@/utils/chatPreviewPromptHistory"
  import {
    clearChatPreviewSession,
    loadChatPreviewSession,
    saveChatPreviewSession,
  } from "@/utils/chatPreviewSession"

  type DraftChat = WithoutDocMetadata<DraftChatConversation>

  type Props = {
    agentId?: string
    workspaceId: string
  }

  let { agentId, workspaceId }: Props = $props()

  const INITIAL_CHAT: DraftChat = {
    title: "",
    messages: [],
    agentId: "",
  }

  let chat: DraftChatConversation = $state({ ...INITIAL_CHAT })
  let lastKey = $state<string | undefined>()
  let refreshKey = $state(0)
  let promptHistory = $state<string[]>([])
  let previewRoleId = $state(Constants.Roles.ADMIN)
  let previewRolesLoading = $state(false)

  const sessionKey = $derived.by(() => {
    const userId = $auth.user?._id
    if (!userId || !workspaceId || !agentId) {
      return undefined
    }
    return { tenantId: $auth.tenantId, userId, workspaceId, agentId }
  })

  const refreshPreviewRoles = async () => {
    if (previewRolesLoading) {
      return
    }
    previewRolesLoading = true
    try {
      await roles.fetchByAppId(workspaceId)
    } finally {
      previewRolesLoading = false
    }
  }

  onMount(refreshPreviewRoles)

  // The preview conversation is not persisted server side, so escalation
  // polling lives here, not in Chatbox.
  let chatbox = $state<
    | { appendAssistantMessage: (m: UIMessage<AgentMessageMetadata>) => void }
    | undefined
  >()
  const delivered = new Set<string>()

  const handleEscalationPending = ({
    escalationId,
  }: {
    escalationId: string
  }) => {
    escalationsStore.track(escalationId)
  }

  // Inject resolved escalations into the chat (reactive: fires on mount + each
  // poll update). Entries are kept so the card keeps its resolved state.
  $effect(() => {
    if (!chatbox) {
      return
    }
    for (const entry of Object.values($escalationsStore.escalations)) {
      if (entry.resumeResult && !delivered.has(entry.escalationId)) {
        delivered.add(entry.escalationId)
        chatbox.appendAssistantMessage(
          entry.resumeResult as UIMessage<AgentMessageMetadata>
        )
      }
    }
  })

  const resolveEscalation = (escalationId: string, accepted: boolean) =>
    escalationsStore.resolve(escalationId, { accepted })

  const resetChat = ({
    agentId: nextAgentId,
    messages = [],
    roleId = Constants.Roles.ADMIN,
  }: {
    agentId?: string
    messages?: UIMessage<AgentMessageMetadata>[]
    roleId?: string
  }) => {
    escalationsStore.reset()
    delivered.clear()
    chat = {
      ...INITIAL_CHAT,
      agentId: nextAgentId || "",
      messages,
    }
    previewRoleId = roleId
    // The preview conversation has no _id, so Chatbox only picks stored
    // messages up when it remounts.
    refreshKey += 1
  }

  const clearChat = () => {
    if (sessionKey) {
      clearChatPreviewSession(sessionKey)
    }
    resetChat({ agentId, roleId: previewRoleId })
  }

  const selectPreviewRole = (roleId: string) => {
    resetChat({ agentId, roleId })
  }

  const previewRoleOptions = $derived(
    $roles.map(role => ({
      label: role.uiMetadata?.displayName || role.name,
      value: role._id,
    }))
  )

  const handlePromptSubmitted = (prompt: string) => {
    const tenantId = $auth.tenantId
    const userId = $auth.user?._id
    if (!agentId || !userId) {
      return
    }

    promptHistory = savePromptHistory({
      tenantId,
      userId,
      workspaceId,
      agentId,
      history: [...promptHistory, prompt],
    })
  }

  $effect(() => {
    const key = sessionKey
    if (!key) {
      if (lastKey !== undefined) {
        lastKey = undefined
        promptHistory = []
        resetChat({ agentId })
      }
      return
    }

    const nextKey = JSON.stringify(key)
    if (nextKey === lastKey) {
      return
    }

    lastKey = nextKey
    promptHistory = loadPromptHistory(key)
    const storedSession = loadChatPreviewSession(key)
    resetChat({
      agentId: key.agentId,
      messages: storedSession?.messages,
      roleId: storedSession?.previewRoleId,
    })
  })

  // Mirror the preview conversation into sessionStorage so it survives reloads.
  // The tuple check keeps a conversation from being written under a newly
  // selected agent, workspace or user before its own session has loaded.
  $effect(() => {
    const messages = chat.messages
    const roleId = previewRoleId
    const key = sessionKey
    if (!key || JSON.stringify(key) !== lastKey) {
      return
    }

    saveChatPreviewSession({
      ...key,
      session: { messages, previewRoleId: roleId },
    })
  })

  // Stop escalation polling when the panel unmounts.
  $effect(() => {
    return () => {
      escalationsStore.reset()
    }
  })
</script>

<div class="agent-chat-panel">
  <div class="chat-preview-header">
    <span class="chat-preview-pill">Chat preview</span>
    <div class="chat-preview-actions">
      <label class="preview-user-picker">
        <span>Test as</span>
        <Select
          value={previewRoleId}
          options={previewRoleOptions}
          placeholder={false}
          size="S"
          autoWidth
          popoverAutoWidth
          loading={previewRolesLoading}
          on:click={refreshPreviewRoles}
          on:change={event => selectPreviewRole(event.detail)}
        />
      </label>
      <button class="chat-preview-refresh" type="button" onclick={clearChat}>
        Clear chat
      </button>
    </div>
  </div>
  <div class="chat-preview-body">
    {#key refreshKey}
      <Chatbox
        bind:this={chatbox}
        bind:chat
        {workspaceId}
        {previewRoleId}
        {promptHistory}
        onpromptsubmitted={handlePromptSubmitted}
        onEscalationPending={handleEscalationPending}
        escalationState={$escalationsStore.escalations}
        showInlineApproval
        onResolve={resolveEscalation}
      />
    {/key}
  </div>
</div>

<style>
  .agent-chat-panel {
    flex: 1 1 auto;
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .chat-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 12px;
  }

  .chat-preview-pill {
    color: var(--spectrum-alias-text-color);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .chat-preview-refresh {
    background: transparent;
    border: none;
    color: var(--spectrum-global-color-gray-700);
    font-size: 14px;
    cursor: pointer;
  }

  .chat-preview-actions,
  .preview-user-picker {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .preview-user-picker {
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }

  .chat-preview-body {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    padding: 12px;
  }

  .chat-preview-body :global(.chat-area) {
    flex: 1 1 0;
    min-height: 0;
    width: 100%;
  }
</style>
