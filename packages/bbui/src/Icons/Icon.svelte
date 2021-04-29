<script context="module">
  import pathsByName from "./icon-paths"
  export const iconOptions = Object.keys(pathsByName)
  export const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
</script>

<script>
  export let name = "arrow"
  export let direction = "n"

  $: paths = pathsByName[name] || []
  $: rotation = directions.indexOf(direction) * 45
</script>

<svg
  class="c"
  viewBox="0 0 24 24"
  fill-rule="evenodd"
  clip-rule="evenodd"
  style={`transform: rotate(${rotation}deg)`}>
  {#each paths as path}
    <path d={path} />
  {/each}
</svg>

<style>
  .c {
    width: 1.25em;
    height: 1.25em;
    fill: currentColor;
    overflow: visible;
    margin-right: var(--spacing-xs);
  }
</style>
