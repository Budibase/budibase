<script>
  import { Input, Select } from "@budibase/bbui"

  export let meta
  export let value = meta.type === "boolean" ? false : ""

  let isSelect =
    meta.type === "string" &&
    meta.constraints &&
    meta.constraints.inclusion &&
    meta.constraints.inclusion.length > 0
  let type = determineInputType(meta)

  function determineInputType(meta) {
    if (meta.type === "datetime") return "date"
    if (meta.type === "number") return "number"
    if (meta.type === "boolean") return "checkbox"
    if (isSelect) return "select"

    return "text"
  }

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
  <Select thin secondary data-cy="{meta.name}-select" bind:value>
    <option />
    {#each meta.constraints.inclusion as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </Select>
{:else}
  {#if type === 'checkbox'}
    <label>{meta.name}</label>
  {/if}
  <Input
    thin
    placeholder={meta.name}
    data-cy="{meta.name}-input"
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
