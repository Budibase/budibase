<script lang="ts">
  import { MarkdownViewer } from "@budibase/bbui"

  export let messages: {
    message: string
    system?: boolean
    isError?: boolean
  }[] = []
</script>

<div class="chatbox">
  {#each messages as message}
    <div class="message" class:system={message.system}>
      <div
        class="background"
        class:systemBackground={message.system}
        class:errorBackground={message.isError}
      >
        <MarkdownViewer value={message.message} />
      </div>
    </div>
  {/each}
</div>

<style>
  div {
    font-size: 18px;
  }

  .chatbox {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .message {
    display: flex;
    justify-content: flex-end;
  }

  .system {
    display: flex;
    justify-content: flex-start;
  }

  .background {
    padding: var(--spacing-l);
    border-radius: 10px;
    background-color: var(--grey-3);
  }

  .systemBackground {
    background-color: transparent !important;
  }

  .errorBackground {
    background-color: rgba(255, 99, 71, 0.85) !important;
  }
</style>
