<script>
  import { Circle } from "svelte-loading-spinners"

  export let size = "60"
  export let color = "var(--ink)"
</script>

<div class="spinner-container">
  <Circle {size} {color} unit="px" />
</div>

<style>
  .spinner-container {
    display: block;
  }
</style>
