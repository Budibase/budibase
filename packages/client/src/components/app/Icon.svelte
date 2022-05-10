<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"
  import Tooltip from "./Tooltip.svelte"
  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let icon
  export let size
  export let color
  export let onClick
  export let tooltip
  export let tooltipColor
  export let tooltipTextColor
  export let tooltipDirection

  $: styles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      color: color || "var(--spectrum-global-color-gray-900)",
    },
  }
</script>

{#if icon}
  <div use:styleable={$component.styles}>
    <Tooltip
      tip={tooltip}
      color={tooltipColor}
      textColor={tooltipTextColor}
      direction={tooltipDirection}
    >
      <i
        use:styleable={styles}
        class="{icon} {size}"
        on:click={onClick}
        class:hoverable={onClick != null}
      />
    </Tooltip>
  </div>
{:else if $builderStore.inBuilder}
  <div use:styleable={styles}>
    <Placeholder />
  </div>
{/if}

<style>
  div {
    font-style: italic;
  }
  @media (hover: hover) {
    .hoverable:hover {
      color: var(--spectrum-alias-icon-color-selected-hover) !important;
      cursor: pointer;
    }
  }
  .hoverable:active {
    color: var(--spectrum-alias-icon-color-selected-hover) !important;
  }
</style>
