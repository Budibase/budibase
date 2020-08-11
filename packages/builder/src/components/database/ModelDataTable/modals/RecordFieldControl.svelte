<script>
  import { Input, Select } from "@budibase/bbui"

  export let type = "text"
  export let value = ""
  export let label
  export let options = []

  let checked = type === "checkbox" ? value : false

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
  <Input
    thin
    placeholder={label}
    data-cy="{label}-input"
    {checked}
    {type}
    {value}
    on:input={handleInput}
    on:change={handleInput} />
{/if}
