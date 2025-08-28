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
      <div class="message user">
        <MarkdownViewer
          value={typeof message.content === "string"
            ? message.content
            : message.content.length > 0
              ? message.content
                  .map(part =>
                    part.type === "text"
                      ? part.text
                      : `${part.type} content not supported`
                  )
                  .join("")
              : "[Empty message]"}
        />
      </div>
    {:else if message.role === "assistant" && message.content}
      <div class="message assistant">
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
    width: 600px;
    margin: 0 auto;
    flex: 1 1 auto;
    padding: 48px 0 24px 0;
  }

  .message {
    display: flex;
    flex-direction: column;
    max-width: 80%;
    padding: var(--spacing-l);
    border-radius: 20px;
    font-size: 16px;
    color: var(--spectrum-global-color-gray-900);
  }

  .message.user {
    align-self: flex-end;
    background-color: var(--grey-3);
  }

  .message.assistant {
    align-self: flex-start;
    background-color: var(--grey-1);
    border: 1px solid var(--grey-3);
  }

  .message.system {
    align-self: flex-start;
    background: none;
    padding-left: 0;
  }

  /* Style the markdown tool sections in assistant messages */
  :global(.assistant strong) {
    color: var(--spectrum-global-color-static-seafoam-700);
  }

  :global(.assistant h3) {
    margin-top: var(--spacing-m);
    color: var(--spectrum-global-color-static-seafoam-700);
  }

  :global(.assistant pre) {
    background-color: var(--grey-2);
    border: 1px solid var(--grey-3);
    border-radius: 4px;
  }
</style>
