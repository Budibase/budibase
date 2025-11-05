<script lang="ts">
  import { appStore } from "@/stores"
  import { Chatbox } from "@budibase/frontend-core"
  import type { AgentChat } from "@budibase/types"

  export let intro: string = "Ask our assistant anything about this app."

  let chat: AgentChat = { title: "", messages: [] }
  $: workspaceId = $appStore?.appId ?? null
</script>

<section class="agent-chat">
  {#if intro}
    <p class="agent-chat__intro">{intro}</p>
  {/if}
  <div class="chat-wrapper">
    {#if workspaceId}
      <Chatbox {chat} {workspaceId} />
    {/if}
  </div>
</section>

<style>
  .agent-chat {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m, 16px);
    width: 100%;
  }

  .agent-chat__intro {
    margin: 0;
    color: var(--spectrum-global-color-gray-700);
    text-align: center;
  }

  .chat-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: stretch;
  }
</style>
