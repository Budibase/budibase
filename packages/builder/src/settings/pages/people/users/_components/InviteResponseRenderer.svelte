<svelte:options runes={true} />

<script>
  let { value } = $props()
</script>

<div style="display: flex; ">
  {#if value === "Unavailable"}
    Email already in use. Please use a different email.
  {:else}
    {value}
  {/if}
</div>

<style>
</style>
