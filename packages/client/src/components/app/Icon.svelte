<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"
  import { loadPhosphorIconWeight } from "../../utils/phosphorIconLoader.js"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let icon
  export let size
  export let color
  export let onClick

  // Backwards compatibility: detect if icon is old RemixIcon format or new Phosphor format
  $: isLegacyIcon = icon && (icon.startsWith("ri-") || icon.includes("remix"))
  $: isPhosphorIcon = icon && !isLegacyIcon

  // Load Phosphor icon weight for new icons
  $: if (isPhosphorIcon) {
    loadPhosphorIconWeight("regular")
  }

  // Generate appropriate icon class
  $: iconClass = isPhosphorIcon
    ? (() => {
        const iconName = icon.replace(/^ph-/, "")
        return `ph ph-${iconName}`
      })()
    : icon

  $: styles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      color: color || "var(--spectrum-global-color-gray-900)",
    },
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if icon}
  <i
    use:styleable={styles}
    class="{iconClass} {size}"
    on:click={onClick}
    class:hoverable={onClick != null}
  ></i>
{:else if $builderStore.inBuilder}
  <div use:styleable={styles}>
    <Placeholder />
  </div>
{/if}

<style>
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
