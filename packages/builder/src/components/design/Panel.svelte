<script lang="ts">
  import { Icon, Body, TooltipPosition, TooltipType } from "@budibase/bbui"

  export let title: string | undefined = ""
  export let icon: string | undefined = ""
  export let iconTooltip: string | undefined = ""
  export let showAddButton: boolean | undefined = false
  export let showBackButton: boolean | undefined = false
  export let showCloseButton: boolean | undefined = false
  export let onClickAddButton: () => void = () => {}
  export let onClickBackButton: () => void = () => {}
  export let onClickCloseButton: () => void = () => {}
  export let borderLeft: boolean | undefined = false
  export let borderRight: boolean | undefined = false
  export let borderBottomHeader: boolean | undefined = true
  export let wide: boolean | undefined = false
  export let extraWide: boolean | undefined = false
  export let closeButtonIcon: string | undefined = "Close"
  export let noHeaderBorder: boolean | undefined = false
  export let titleCSS: boolean | undefined = true
  export let customWidth: number | undefined = undefined

  $: customHeaderContent = $$slots["panel-header-content"]
  $: customTitleContent = $$slots["panel-title-content"]

  $: panelStyle =
    customWidth && !isNaN(customWidth)
      ? `min-width: ${customWidth}px; width: ${customWidth}px; flex: 0 0 ${customWidth}px;`
      : undefined
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="panel"
  class:wide
  class:extraWide
  class:borderLeft
  class:borderRight
  style={panelStyle}
>
  {#if title || customTitleContent}
    <div
      class="header"
      class:custom={customHeaderContent}
      class:borderBottom={borderBottomHeader}
      class:noHeaderBorder
    >
      {#if showBackButton}
        <Icon name="arrow-left" hoverable on:click={onClickBackButton} />
      {/if}
      {#if icon}
        <div class="icon-container">
          <Icon
            name={icon}
            tooltipType={TooltipType.Info}
            tooltip={iconTooltip}
            tooltipPosition={TooltipPosition.Top}
            color="var(--spectrum-global-color-static-gray-50)"
            weight="bold"
          />
        </div>
      {/if}
      <div class:title={titleCSS}>
        {#if customTitleContent}
          <slot name="panel-title-content" />
        {:else}
          <Body
            size="S"
            weight="500"
            color="var(--spectrum-global-color-gray-900)">{title || ""}</Body
          >
        {/if}
      </div>
      {#if showAddButton}
        <div class="add-button" on:click={onClickAddButton}>
          <Icon name="plus" />
        </div>
      {/if}
      {#if showCloseButton}
        <Icon name={closeButtonIcon} hoverable on:click={onClickCloseButton} />
      {/if}
    </div>
  {/if}

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

  .icon-container {
    background-color: #aa4321;
    border: 0.5px solid #c96442;
    padding: 4px;
    border-radius: 8px;
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
