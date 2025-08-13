<script lang="ts">
  import { Icon, Button } from "@budibase/bbui"

  export let icon: string
  export let buttonText: string | undefined = undefined
</script>

<div class="notification">
  <div class="info">
    <Icon name={icon} />
    <slot />
  </div>
  {#if buttonText}
    <Button cta on:click>{buttonText}</Button>
  {/if}
</div>

<style>
  .notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--spacing-s);
    background-color: #1d2e55;
    border-radius: var(--spacing-l);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
  }

  .info {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
