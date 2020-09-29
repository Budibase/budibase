<script>
  import { Input, Select, Label, DatePicker, Toggle } from "@budibase/bbui"
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
</script>

{#if type === 'select'}
  <Select
    thin
    secondary
    label={meta.name}
    data-cy="{meta.name}-select"
    bind:value>
    <option value="">Choose an option</option>
    {#each meta.constraints.inclusion as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </Select>
{:else if type === 'date'}
  <DatePicker label={meta.name} bind:value />
{:else if type === 'file'}
  <div>
    <Label extraSmall grey forAttr={'dropzone-label'}>{meta.name}</Label>
    <Dropzone bind:files={value} />
  </div>
{:else if type === 'checkbox'}
  <Toggle text={meta.name} bind:checked={value} data-cy="{meta.name}-input" />
{:else}
  <Input thin label={meta.name} data-cy="{meta.name}-input" {type} bind:value />
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
