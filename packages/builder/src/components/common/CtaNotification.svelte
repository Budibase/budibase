<script lang="ts">
  import { Icon, Button, ActionButton } from "@budibase/bbui"

  export let icon: string
  export let button: { message: string } | { icon: string } | undefined =
    undefined
</script>

<div class="notification">
  <div class="info">
    <Icon name={icon} />
    <slot />
  </div>
  {#if button && "message" in button}
    <Button cta on:click>{button.message}</Button>
  {:else if button && "icon" in button}
    <ActionButton on:click quiet icon={button.icon} noPadding />
  {/if}
</div>

<style>
  .notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--spacing-s) var(--spacing-l);
    background-color: #1d2e55;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
  }

  .info {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
