<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"
  import { loadPhosphorIconWeight } from "../../utils/phosphorIconLoader.js"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let icon
  export let size = 24
  export let weight = "regular"
  export let color
  export let onClick

  $: if (weight && icon) {
    loadPhosphorIconWeight(weight)
  }

  $: styles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      color: color || "var(--spectrum-global-color-gray-900)",
      "font-size": `${size}px`,
    },
  }

  $: iconClass = icon
    ? (() => {
        // Handle both prefixed (ph-star) and clean (star) icon names
        const iconName = icon.replace(/^ph-/, "")
        if (weight === "regular") {
          return `ph ph-${iconName}`
        } else {
          return `ph-${weight} ph-${iconName}`
        }
      })()
    : ""
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if icon}
  <i
    class={iconClass}
    use:styleable={styles}
    on:click={onClick}
    class:hoverable={onClick != null}
    style="width: {size}px; height: {size}px; display: inline-flex; align-items: center; justify-content: center;"
  ></i>
{:else if $builderStore.inBuilder}
  <div use:styleable={styles} style="width: {size}px; height: {size}px;">
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
