<script>
  import { Input, Select, Label, DatePicker } from "@budibase/bbui"
  import Dropzone from "components/common/Dropzone.svelte"

  export let meta
  export let value = meta.type === "boolean" ? false : ""
  export let originalValue

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
    if (meta.type === "attachment") return "file"
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
    <option value="">Choose an option</option>
    {#each meta.constraints.inclusion as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </Select>
{:else if type === 'date'}
  <Label small forAttr={'datepicker-label'}>{meta.name}</Label>
  <DatePicker bind:value />
{:else if type === 'file'}
  <Label small forAttr={'dropzone-label'}>{meta.name}</Label>
  <Dropzone bind:files={value} />
{:else if type === 'checkbox'}
  <div class="checkbox">
    <Label small forAttr={'checkbox-label'}>{meta.name}</Label>
    <input
      checked={value}
      data-cy="{meta.name}-input"
      {type}
      on:change={handleInput} />
  </div>
{:else}
  <Input
    thin
    placeholder={meta.name}
    data-cy="{meta.name}-input"
    {type}
    {value}
    on:change={handleInput} />
{/if}

<style>
  .checkbox {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .checkbox :global(label) {
    margin-bottom: 0;
    margin-right: var(--spacing-xs);
  }
</style>
