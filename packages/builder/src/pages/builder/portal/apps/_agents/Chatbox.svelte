<script lang="ts">
  export let messages: { message: string, isSystem?: boolean }[] = []
</script>

<div class="chatbox">
  {#each messages as message}
    <div class="message" class:system={message.isSystem}>
      <div class="background" class:systemBackground={message.isSystem}>
        {message.message}
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
</style>