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
    <option />
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
    on:change={handleInput} />
{/if}

<style>
  label {
    font-weight: 500;
    font-size: var(--font-size-s);
    margin-bottom: 12px;
  }
</style>
