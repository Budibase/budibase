<script lang="ts">
  import type {
    AgentMessageMetadata,
    DraftChatConversation,
    WithoutDocMetadata,
  } from "@budibase/types"
  import type { UIMessage } from "ai"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import { escalationsStore } from "@/stores/portal/escalations"

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
  let lastKey = $state("")
  let refreshKey = $state(0)

  // Preview is transient, so escalation polling lives here, not in Chatbox.
  let chatbox = $state<
    | { appendAssistantMessage: (_m: UIMessage<AgentMessageMetadata>) => void }
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

  $effect(() => {
    if (!workspaceId) {
      return
    }

    const nextKey = `${workspaceId}:${agentId || ""}`
    if (nextKey === lastKey) {
      return
    }

    lastKey = nextKey
    resetChat(agentId)
  })
</script>

<div class="agent-chat-panel">
  <div class="chat-preview-header">
    <span class="chat-preview-pill">Chat preview</span>
    <button class="chat-preview-refresh" type="button" onclick={refreshChat}>
      Refresh chat
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
        onEscalationPending={handleEscalationPending}
        escalationState={$escalationsStore.escalations}
        showInlineApproval={true}
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
