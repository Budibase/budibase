<script>
  import { backendUiStore } from "builderStore"
  import { Input, Label } from "@budibase/bbui"

  export let value

  function setParsedValue(evt, field) {
    const fieldSchema = value.model.schema[field]
    if (fieldSchema.type === "number") {
      value[field] = parseInt(evt.target.value)
      return
    }

    value[field] = evt.target.value
  }
</script>

<div class="bb-margin-xl block-field">
  <select class="budibase__input" bind:value={value.model}>
    {#each $backendUiStore.models as model}
      <option value={model}>{model.name}</option>
    {/each}
  </select>
</div>

{#if value.model}
  <div class="bb-margin-xl block-field">
    <Label small forAttr={'fields'}>Fields</Label>
    {#each Object.keys(value.model.schema) as field}
      <div class="bb-margin-xl">
        <Input
          thin
          value={value[field]}
          label={field}
          on:change={e => setParsedValue(e, field)} />
      </div>
    {/each}
  </div>
{/if}
