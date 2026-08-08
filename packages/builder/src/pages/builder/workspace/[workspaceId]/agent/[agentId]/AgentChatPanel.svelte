<script lang="ts">
  import {
    FeatureFlag,
    type AgentMessageMetadata,
    type DraftChatConversation,
    type WithoutDocMetadata,
  } from "@budibase/types"
  import type { UIMessage } from "ai"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import { escalationsStore } from "@/stores/portal/escalations"
  import { auth, featureFlags } from "@/stores/portal"
  import {
    loadPromptHistory,
    savePromptHistory,
  } from "@/utils/chatPreviewPromptHistory"

  type DraftChat = WithoutDocMetadata<DraftChatConversation>

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
    <button class="chat-preview-refresh" type="button" onclick={refreshChat}>
      Clear chat
    </button>
  </div>
  <div class="chat-preview-body">
    {#key refreshKey}
      <Chatbox
        bind:this={chatbox}
        bind:chat
        persistConversation={false}
        {workspaceId}
        isAgentPreviewChat={true}
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
