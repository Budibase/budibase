<script>
  export let value
  export let selected = false
  export let onChange
  export let type = "text"
  export let readonly = false

  $: editable = selected && !readonly

  const handleChange = e => {
    onChange(e.target.value)
  }
</script>

{#if editable}
  <input {type} value={value || ""} on:change={handleChange} />
{:else}
  <div class="text-cell">
    {value || ""}
  </div>
{/if}

<style>
  .text-cell {
    padding: 0 var(--cell-padding);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  input {
    border: none;
    padding: 0;
    margin: 0 var(--cell-padding);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: none;
    font-size: var(--cell-font-size);
    font-family: var(--font-sans);
    color: inherit;
  }
  input:focus {
    outline: none;
  }
</style>
