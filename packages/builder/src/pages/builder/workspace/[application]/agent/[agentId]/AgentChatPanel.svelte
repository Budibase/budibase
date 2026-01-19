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

  const resetChat = (nextAgentId?: string) => {
    chat = {
      ...INITIAL_CHAT,
      agentId: nextAgentId || "",
    }
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
  <Chatbox
    bind:chat
    loading={false}
    persistConversation={false}
    {workspaceId}
  />
</div>

<style>
  .agent-chat-panel {
    flex: 1 1 auto;
    display: flex;
    min-width: 0;
    min-height: 0;
  }
</style>
