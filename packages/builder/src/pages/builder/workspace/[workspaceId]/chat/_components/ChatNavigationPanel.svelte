<script lang="ts">
  import SharedChatNavigationPanel from "@budibase/frontend-core/src/components/Chatbox/ChatNavigationPanel.svelte"

  type EnabledAgentListItem = {
    agentId: string
    name?: string
    isDefault?: boolean
    icon?: string
    iconColor?: string
  }

  type ConversationListItem = {
    _id?: string
    title?: string
  }

  export let enabledAgentList: EnabledAgentListItem[] = []
  export let conversationHistory: ConversationListItem[] = []
  export let deletingChat = false
  export let selectedConversationId: string | undefined
  export let selectedAgentName: string | undefined
</script>

<SharedChatNavigationPanel
  {enabledAgentList}
  {conversationHistory}
  {deletingChat}
  {selectedConversationId}
  {selectedAgentName}
  on:agentSelected
  on:conversationSelected
  on:conversationDeleted
/>
