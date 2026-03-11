<script lang="ts">
  export let label = ""
  export let value = ""
  export let disabled = false
  export let readonly = false
  export let error: string | undefined = undefined
</script>

<label>
  <span>{label}</span>
  <input aria-label={label} bind:value {disabled} {readonly} />
  {#if error}
    <span>{error}</span>
  {/if}
</label>
