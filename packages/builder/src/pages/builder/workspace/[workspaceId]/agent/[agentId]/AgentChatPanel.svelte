<script lang="ts">
  import {
    FeatureFlag,
    type AgentMessageMetadata,
    type DraftChatConversation,
    type WithoutDocMetadata,
    type User,
  } from "@budibase/types"
  import type { UIMessage } from "ai"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import { Select } from "@budibase/bbui"
  import { escalationsStore } from "@/stores/portal/escalations"
  import { auth, featureFlags, users } from "@/stores/portal"
  import { roles } from "@/stores/builder"
  import { sdk } from "@budibase/shared-core"
  import { onMount } from "svelte"
  import {
    loadPromptHistory,
    savePromptHistory,
  } from "@/utils/chatPreviewPromptHistory"

  type DraftChat = WithoutDocMetadata<DraftChatConversation>
  const CURRENT_USER_VALUE = "current-user"
  const PUBLIC_USER_VALUE = "public-user"

  type Props = {
    agentId?: string
    workspaceId: string
  }

  let { agentId, workspaceId }: Props = $props()

  const INITIAL_CHAT: DraftChat = {
    title: "",
    messages: [],
    chatAppId: "",
    agentId: "",
  }

  let chat: DraftChatConversation = $state({ ...INITIAL_CHAT })
  let lastKey = $state<string | undefined>()
  let refreshKey = $state(0)
  let promptHistory = $state<string[]>([])
  let previewUserId = $state<string | undefined>()
  let previewAsPublic = $state(false)
  let previewUsers = $state<User[]>([])
  let previewUsersLoading = $state(false)

  const refreshPreviewUsers = async () => {
    if (previewUsersLoading) {
      return
    }
    previewUsersLoading = true
    try {
      const [result] = await Promise.all([
        users.search({ workspaceId, paginate: false }),
        roles.fetchByAppId(workspaceId),
      ])
      const currentUserIds = new Set(
        [$auth.user?._id, $auth.user?.userId].filter(Boolean)
      )
      previewUsers = (result.data as User[]).filter(
        user =>
          user.budibaseAccess !== false &&
          ![user._id, user.userId].some(userId => currentUserIds.has(userId))
      )
    } finally {
      previewUsersLoading = false
    }
  }

  onMount(refreshPreviewUsers)

  // Preview is transient, so escalation polling lives here, not in Chatbox.
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

  const resetChat = (nextAgentId?: string) => {
    escalationsStore.reset()
    delivered.clear()
    chat = {
      ...INITIAL_CHAT,
      agentId: nextAgentId || "",
    }
    refreshKey += 1
  }

  const refreshChat = () => {
    resetChat(agentId)
  }

  const selectPreviewUser = (userId: string) => {
    previewAsPublic = userId === PUBLIC_USER_VALUE
    previewUserId =
      userId === CURRENT_USER_VALUE || previewAsPublic ? undefined : userId
    resetChat(agentId)
  }

  const getPreviewUserLabel = (user: User) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ")
    const prodWorkspaceId = sdk.workspaces.getProdWorkspaceID(workspaceId)
    const roleId = user.roles?.[prodWorkspaceId]
    const roleName = $roles.find(role => role._id === roleId)?.uiMetadata
      ?.displayName
    return `${name || user.email}${roleName ? ` · ${roleName}` : ""}`
  }

  const previewUserOptions = $derived([
    { label: "Current user", value: CURRENT_USER_VALUE },
    { label: "Public user", value: PUBLIC_USER_VALUE },
    ...previewUsers.map(user => ({
      label: getPreviewUserLabel(user),
      value: user._id,
    })),
  ])

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
    if (!workspaceId) {
      return
    }

    const tenantId = $auth.tenantId
    const userId = $auth.user?._id

    if (!userId || !agentId) {
      if (lastKey !== undefined) {
        lastKey = undefined
        promptHistory = []
        resetChat(agentId)
      }
      return
    }

    const nextKey = JSON.stringify([tenantId, userId, workspaceId, agentId])
    if (nextKey === lastKey) {
      return
    }

    lastKey = nextKey
    promptHistory = loadPromptHistory({
      tenantId,
      userId,
      workspaceId,
      agentId,
    })
    resetChat(agentId)
  })
</script>

<div class="agent-chat-panel">
  <div class="chat-preview-header">
    <span class="chat-preview-pill">Chat preview</span>
    <div class="chat-preview-actions">
      <label class="preview-user-picker">
        <span>Test as</span>
        <Select
          value={previewAsPublic
            ? PUBLIC_USER_VALUE
            : previewUserId || CURRENT_USER_VALUE}
          options={previewUserOptions}
          placeholder={false}
          size="S"
          autoWidth
          popoverAutoWidth
          loading={previewUsersLoading}
          on:click={refreshPreviewUsers}
          on:change={event => selectPreviewUser(event.detail)}
        />
      </label>
      <button class="chat-preview-refresh" type="button" onclick={refreshChat}>
        Clear chat
      </button>
    </div>
  </div>
  <div class="chat-preview-body">
    {#key refreshKey}
      <Chatbox
        bind:this={chatbox}
        bind:chat
        persistConversation={false}
        {workspaceId}
        isAgentPreviewChat={true}
        {previewUserId}
        {previewAsPublic}
        {promptHistory}
        onpromptsubmitted={handlePromptSubmitted}
        onEscalationPending={handleEscalationPending}
        escalationState={$escalationsStore.escalations}
        showInlineApproval={$featureFlags[FeatureFlag.ESCALATION]}
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
