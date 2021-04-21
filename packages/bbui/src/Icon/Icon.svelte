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

  $: rotation = directions.indexOf(direction) * 45
  $: useDefault = ![s, m, l, xl].includes(true)
</script>

<svg
  on:click
  class:spectrum-Icon--sizeS={s}
  class:spectrum-Icon--sizeM={m || useDefault}
  class:spectrum-Icon--sizeL={l}
  class:spectrum-Icon--sizeXL={xl}
  class="spectrum-Icon"
  focusable="false"
  aria-hidden={hidden}
  aria-label={name}
  style={`transform: rotate(${rotation}deg)`}>
  <use xlink:href="#spectrum-icon-18-{name}" />
</svg>
