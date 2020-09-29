<script>
  import { Input, Select, Label, DatePicker, Toggle } from "@budibase/bbui"
  import Dropzone from "components/common/Dropzone.svelte"
  import { capitalise } from "../../../../helpers"

  export let meta
  export let value = meta.type === "boolean" ? false : ""

  const type = determineInputType(meta)
  const label = capitalise(meta.name)

  function determineInputType(meta) {
    if (meta.type === "datetime") return "date"
    if (meta.type === "number") return "number"
    if (meta.type === "boolean") return "checkbox"
    if (meta.type === "attachment") return "file"
    if (meta.type === "options") return "select"
    return "text"
  }
</script>

{#if type === 'select'}
  <Select thin secondary {label} data-cy="{meta.name}-select" bind:value>
    <option value="">Choose an option</option>
    {#each meta.constraints.inclusion as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </Select>
{:else if type === 'date'}
  <DatePicker {label} bind:value />
{:else if type === 'file'}
  <div>
    <Label extraSmall grey forAttr={'dropzone-label'}>{label}</Label>
    <Dropzone bind:files={value} />
  </div>
{:else if type === 'checkbox'}
  <Toggle text={label} bind:checked={value} data-cy="{meta.name}-input" />
{:else}
  <Input thin {label} data-cy="{meta.name}-input" {type} bind:value />
{/if}
