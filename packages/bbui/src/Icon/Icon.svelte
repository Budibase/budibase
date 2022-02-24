<script context="module">
  export const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
</script>

<script>
  export let direction = "n"
  export let name = "Add"
  export let hidden = false
  export let size = "M"
  export let hoverable = false
  export let disabled = false
  export let color

  $: rotation = getRotation(direction)

  const getRotation = direction => {
    return directions.indexOf(direction) * 45
  }
</script>

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
  <use xlink:href="#spectrum-icon-18-{name}" />
</svg>

<style>
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
</style>
