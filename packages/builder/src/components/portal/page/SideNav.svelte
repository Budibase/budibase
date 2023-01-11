<script>
  export let title
</script>

<div class="side-nav">
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <slot />
</div>

<style>
  .side-nav {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 4px;
  }
  .title {
    margin-left: var(--spacing-m);
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    margin-bottom: var(--spacing-m);
  }

  @media (max-width: 640px) {
    .side-nav {
      border-bottom: var(--border-light);
      margin: 0 -24px;
      padding: 0 24px 32px 24px;
    }
  }
</style>
