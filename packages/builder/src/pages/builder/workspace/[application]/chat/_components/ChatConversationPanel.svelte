<script lang="ts">
  import SharedChatConversationPanel from "@budibase/frontend-core/src/components/Chatbox/ChatConversationPanel.svelte"
  import { helpers } from "@budibase/shared-core"
  import type { ChatConversation, DraftChatConversation } from "@budibase/types"
  import { auth } from "@/stores/portal"

  type ChatConversationLike = ChatConversation | DraftChatConversation

  type EnabledAgentListItem = {
    agentId: string
    name?: string
    icon?: string
    iconColor?: string
  }

  export let selectedAgentId: string | null = null
  export let enabledAgentList: EnabledAgentListItem[] = []
  export let conversationStarters: { prompt: string }[] = []
  export let agentAvailability:
    | "no_selection"
    | "deleted"
    | "offline"
    | "disabled"
    | "ready" = "ready"

  export let chat: ChatConversationLike
  export let loading: boolean = false
  export let workspaceId: string
  export let initialPrompt: string = ""

  $: userName = $auth.user ? helpers.getUserLabel($auth.user) : ""
</script>

<SharedChatConversationPanel
  bind:chat
  {selectedAgentId}
  {enabledAgentList}
  {conversationStarters}
  {agentAvailability}
  {loading}
  {workspaceId}
  {initialPrompt}
  {userName}
  on:chatSaved
  on:agentSelected
  on:startChat
/>
