<script>
  import { Icon, Heading } from "@budibase/bbui"

  export let title
  export let icon
</script>

<div class="settings-panel">
  {#if title}
    <div class="header">
      {#if icon}
        <Icon name={icon} />
      {/if}
      <div class="title" {title}>
        <Heading size="XS">{title || ""}</Heading>
      </div>
    </div>
  {/if}
  <div class="body">
    <slot />
  </div>
</div>

<style>
  .settings-panel {
    width: 260px;
    background: var(--background);
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .header {
    flex: 0 0 48px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 var(--spacing-l);
    border-bottom: var(--border-light);
    gap: var(--spacing-m);
  }
  .header :global(*) {
    color: var(--spectrum-global-color-gray-700);
  }
  .title {
    flex: 1 1 auto;
    width: 0;
  }
  .title :global(h1) {
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .body {
    flex: 1 1 auto;
    overflow: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
