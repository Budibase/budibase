<script context="module">
  export const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
</script>

<script>
  export let direction = "n"
  export let name = "Add"
  export let hidden = false
  export let s = false
  export let m = false
  export let l = false
  export let xl = false
  export let hoverable = false
  export let disabled = false

  $: rotation = directions.indexOf(direction) * 45
  $: useDefault = ![s, m, l, xl].includes(true)
</script>

<svg
  on:click
  class:hoverable
  class:disabled
  class:spectrum-Icon--sizeS={s}
  class:spectrum-Icon--sizeM={m || useDefault}
  class:spectrum-Icon--sizeL={l}
  class:spectrum-Icon--sizeXL={xl}
  class="spectrum-Icon"
  focusable="false"
  aria-hidden={hidden}
  aria-label={name}
  style={`transform: rotate(${rotation}deg)`}
>
  <use xlink:href="#spectrum-icon-18-{name}" />
</svg>

<style>
  svg.hoverable {
    pointer-events: all;
    transition: color var(--spectrum-global-animation-duration-100, 130ms);
  }
  svg.hoverable:hover {
    color: var(--spectrum-alias-icon-color-selected);
    cursor: pointer;
  }

  svg.disabled {
    color: var(--spectrum-global-color-gray-500) !important;
    pointer-events: none !important;
  }
</style>
