<script>
  export let value
  export let selected = false
  export let onChange

  const handleChange = e => {
    onChange(e.target.value)
  }
</script>

{#if selected}
  <input type="text" value={value || ""} on:change={handleChange} />
{:else}
  <div class="text-cell">
    {value || ""}
  </div>
{/if}

<style>
  .text-cell {
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  input {
    border: none;
    padding: 0;
    margin: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: none;
    font-size: 14px;
    font-family: var(--font-sans);
    color: inherit;
  }
  input:focus {
    outline: none;
  }
</style>
