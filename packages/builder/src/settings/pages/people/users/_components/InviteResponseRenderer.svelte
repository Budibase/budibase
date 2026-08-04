<svelte:options runes={true} />

<script lang="ts">
  interface Props {
    value: string
  }

  let { value }: Props = $props()
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
