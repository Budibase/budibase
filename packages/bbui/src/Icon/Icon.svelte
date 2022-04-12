<script context="module">
  export const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
</script>

<script>
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import { fade } from "svelte/transition"

  export let direction = "n"
  export let name = "Add"
  export let hidden = false
  export let size = "M"
  export let hoverable = false
  export let disabled = false
  export let color
  export let tooltip

  $: rotation = getRotation(direction)

  let showTooltip = false

  const getRotation = direction => {
    return directions.indexOf(direction) * 45
  }
</script>

<div
  on:mouseover={() => (showTooltip = true)}
  on:focus={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
>
  <svg
    on:click
    class:hoverable
    class:disabled
    class="spectrum-Icon spectrum-Icon--size{size}"
    focusable="false"
    aria-hidden={hidden}
    aria-label={name}
    style={`transform: rotate(${rotation}deg); ${
      color ? `color: ${color};` : ""
    }`}
  >
    <use style="pointer-events: none;" xlink:href="#spectrum-icon-18-{name}" />
  </svg>
  {#if tooltip && showTooltip}
    <div class="tooltip" in:fade={{ duration: 130, delay: 250 }}>
      <Tooltip textWrapping={true} direction={"bottom"} text={tooltip} />
    </div>
  {/if}
</div>

<style>
  div {
    position: relative;
    display: grid;
    place-items: center;
  }

  svg.hoverable {
    pointer-events: all;
    transition: color var(--spectrum-global-animation-duration-100, 130ms);
  }
  svg.hoverable:hover {
    color: var(--spectrum-alias-icon-color-selected-hover);
    cursor: pointer;
  }

  svg.disabled {
    color: var(--spectrum-global-color-gray-500) !important;
    pointer-events: none !important;
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    left: 50%;
    top: 100%;
    white-space: nowrap;
    transform: translateX(-50%);
  }
</style>
