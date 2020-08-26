<script>
  import { Input, Select } from "@budibase/bbui"

  export let type = "text"
  export let value = type === "checkbox" ? false : ""
  export let label
  export let options = []

  const handleInput = event => {
    if (event.target.type === "checkbox") {
      value = event.target.checked
      return
    }

    if (event.target.type === "number") {
      value = parseInt(event.target.value)
      return
    }

    value = event.target.value
  }
</script>

{#if type === 'select'}
  <Select thin secondary data-cy="{label}-select" bind:value>
    <option />
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </Select>
{:else}
  {#if type === 'checkbox'}
    <label>{label}</label>
  {/if}
  <Input
    thin
    placeholder={label}
    data-cy="{label}-input"
    checked={value}
    {type}
    {value}
    on:input={handleInput}
    on:change={handleInput} />
{/if}

<style>
  label {
    font-weight: 500;
    font-size: var(--font-size-s);
    float: left;
    margin-right: 8px;
  }
</style>
