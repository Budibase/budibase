<script>
  import { slide } from "svelte/transition"

  export let error = null
</script>

<div transition:slide|local={{ duration: 130 }} class="error-message">
  {error}
</div>

<style>
  .error-message {
    background: var(--spectrum-global-color-red-400);
    color: white;
    font-size: 14px;
    padding: 6px 16px;
    font-weight: 500;
  }
</style>
