<script lang="ts">
  import { AgentChatbox } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { appStore } from "@/stores/app"
  import type { AgentChat } from "@budibase/types"

  export let intro: string = "Ask our assistant anything about this app."
  export let placeholder: string = "Ask Budibase..."
  export let sendButtonLabel: string = "Send"

  let chat: AgentChat = { title: "", messages: [] }
  let workspaceId: string | null = null

  $: workspaceId = $appStore?.appId ?? null
</script>

<AgentChatbox
  bind:chat
  {intro}
  {placeholder}
  sendButtonLabel={sendButtonLabel}
  workspaceId={workspaceId}
  agentChatStream={API.agentChatStream}
/>
