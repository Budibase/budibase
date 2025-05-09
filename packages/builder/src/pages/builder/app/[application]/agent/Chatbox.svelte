<script lang="ts">
  import { MarkdownViewer } from "@budibase/bbui"
  import BBAI from "@/components/common/Icons/BBAI.svelte"
  import { type AgentChat } from "@budibase/types"

  export let chat: AgentChat
  export let loading: boolean = false
</script>

<div class="chatbox">
  {#each chat.messages as message}
    {#if message.role === "user"}
      <div class="message">
        <MarkdownViewer value={message.content} />
      </div>
    {:else if message.role === "assistant" && message.content}
      <div class="message system">
        <MarkdownViewer value={message.content} />
      </div>
    {/if}
  {/each}
  {#if loading}
    <div class="message system">
      <BBAI size="48px" animate />
    </div>
  {/if}
</div>

<style>
  .chatbox {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 800px;
    margin: 0 auto;
    flex: 1 1 auto;
    padding: 48px 0 24px 0;
  }

  .message {
    display: flex;
    align-self: flex-end;
    max-width: 80%;
    padding: var(--spacing-l);
    border-radius: 20px;
    background-color: var(--grey-3);
    font-size: 16px;
    color: var(--spectrum-global-color-gray-900);
  }

  .message.system {
    align-self: flex-start;
    background: none;
    padding-left: 0;
  }
</style>
