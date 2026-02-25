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
  export let selectedConversationId: string | undefined
</script>

<SharedChatNavigationPanel
  {enabledAgentList}
  {conversationHistory}
  {selectedConversationId}
  on:agentSelected
  on:conversationSelected
/>
