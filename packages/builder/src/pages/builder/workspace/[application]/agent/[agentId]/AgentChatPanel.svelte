<script lang="ts">
  import type {
    DraftChatConversation,
    WithoutDocMetadata,
  } from "@budibase/types"
  import { Chatbox } from "@budibase/frontend-core/src/components"

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

  const resetChat = (nextAgentId?: string) => {
    chat = {
      ...INITIAL_CHAT,
      agentId: nextAgentId || "",
    }
  }

  const refreshChat = () => {
    resetChat(agentId)
    refreshKey += 1
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
        bind:chat
        persistConversation={false}
        {workspaceId}
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
  }

  .chat-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-m) var(--spacing-l);
    flex-shrink: 0;
  }

  .chat-preview-pill {
    background: var(--spectrum-global-color-gray-200);
    color: white;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .chat-preview-refresh {
    background: transparent;
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }

  .chat-preview-body {
    flex: 1 1 auto;
    min-height: 0;
    padding: var(--spacing-l);
    display: flex;
  }

  .chat-preview-body :global(.chat-area) {
    height: 100%;
  }
</style>
