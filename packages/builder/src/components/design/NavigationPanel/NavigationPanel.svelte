<script>
  import { Icon, Heading } from "@budibase/bbui"

  export let title
  export let showAddButton = false
  export let showBackButton = false
  export let onClickAddButton
  export let onClickBackButton
  export let wide = false
</script>

<div class="navigation-panel" class:wide>
  <div class="header">
    {#if showBackButton}
      <Icon name="ArrowLeft" hoverable on:click={onClickBackButton} />
    {/if}
    <div class="title">
      <Heading size="XS">{title || ""}</Heading>
    </div>
    {#if showAddButton}
      <div class="add-button" on:click={onClickAddButton}>
        <Icon name="Add" />
      </div>
    {/if}
  </div>
  <slot />
</div>

<style>
  .navigation-panel {
    width: 260px;
    background: var(--background);
    border-right: var(--border-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    overflow: auto;
  }
  .navigation-panel.wide {
    width: 360px;
  }
  .header {
    flex: 0 0 48px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--spacing-l);
    border-bottom: var(--border-light);
    gap: var(--spacing-l);
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
  .add-button {
    flex: 0 0 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    background: var(--spectrum-semantic-cta-color-background-default);
    transition: background var(--spectrum-global-animation-duration-100, 130ms)
      ease-out;
  }
  .add-button:hover {
    background: var(--spectrum-semantic-cta-color-background-hover);
  }
  .add-button :global(svg) {
    fill: white;
  }
</style>
