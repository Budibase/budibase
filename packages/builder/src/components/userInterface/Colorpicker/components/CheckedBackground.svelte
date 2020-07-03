<script>
  import { buildStyle } from "../helpers.js"
  import { fade } from "svelte/transition"

  export let backgroundSize = "10px"
  export let borderRadius = ""
  export let height = ""
  export let width = ""
  export let margin = ""

  $: style = buildStyle({ backgroundSize, borderRadius, height, width, margin })
</script>

<div in:fade {style}>
  <slot />
</div>

<style>
  div {
    background-image: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
    height: fit-content;
    width: fit-content;
    width: -moz-fit-content;
    height: -moz-fit-content;
  }
</style>
