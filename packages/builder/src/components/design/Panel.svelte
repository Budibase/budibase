<script>
  import { Icon, Body, TooltipPosition, TooltipType } from "@budibase/bbui"

  export let title
  export let icon
  export let iconTooltip
  export let showAddButton = false
  export let showBackButton = false
  export let showCloseButton = false
  export let onClickAddButton
  export let onClickBackButton
  export let onClickCloseButton
  export let borderLeft = false
  export let borderRight = false
  export let borderBottomHeader = true
  export let wide = false
  export let extraWide = false
  export let closeButtonIcon = "Close"
  export let noHeaderBorder = false
  export let titleCSS = true

  $: customHeaderContent = $$slots["panel-header-content"]
  $: customTitleContent = $$slots["panel-title-content"]
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="panel"
  class:wide
  class:extraWide
  class:borderLeft
  class:borderRight
>
  <div
    class="header"
    class:custom={customHeaderContent}
    class:borderBottom={borderBottomHeader}
    class:noHeaderBorder
  >
    {#if showBackButton}
      <Icon name="ArrowLeft" hoverable on:click={onClickBackButton} />
    {/if}
    {#if icon}
      <Icon
        name={icon}
        tooltipType={TooltipType.Info}
        tooltip={iconTooltip}
        tooltipPosition={TooltipPosition.Top}
      />
    {/if}
    <div class:title={titleCSS}>
      {#if customTitleContent}
        <slot name="panel-title-content" />
      {:else}
        <Body size="S">{title || ""}</Body>
      {/if}
    </div>
    {#if showAddButton}
      <div class="add-button" on:click={onClickAddButton}>
        <Icon name="Add" />
      </div>
    {/if}
    {#if showCloseButton}
      <Icon name={closeButtonIcon} hoverable on:click={onClickCloseButton} />
    {/if}
  </div>

  {#if customHeaderContent}
    <span class="custom-content-wrap">
      <slot name="panel-header-content" />
    </span>
  {/if}

  <div class="body">
    <slot />
  </div>
</div>

<style>
  .panel {
    min-width: 260px;
    width: 260px;
    flex: 0 0 260px;
    background: var(--background);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    transition: width 130ms ease-out;
    overflow: hidden;
  }
  .panel.borderLeft {
    border-left: var(--border-light);
  }
  .panel.borderRight {
    border-right: var(--border-light);
  }
  .panel.wide {
    min-width: 310px;
    width: 310px;
    flex: 0 0 310px;
  }
  .panel.extraWide {
    width: 450px;
    flex: 0 0 450px;
  }
  .header {
    flex: 0 0 48px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--spacing-l);
    gap: var(--spacing-m);
  }

  .noHeaderBorder {
    border-bottom: none !important;
  }
  .header.borderBottom {
    border-bottom: var(--border-light);
  }
  .title {
    flex: 1 1 auto;
    width: 0;
  }
  .title :global(p) {
    overflow: hidden;
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
  .body {
    flex: 1 1 auto;
    overflow: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .header.custom {
    border: none;
  }
  .custom-content-wrap {
    border-bottom: var(--border-light);
  }
  .title {
    display: flex;
  }
</style>
