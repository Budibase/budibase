<script>
  import { backendUiStore } from "builderStore"
  import { Input, Label } from "@budibase/bbui"

  export let value
  $: modelId = value && value.model ? value.model._id : ""
  $: schemaFields = Object.keys(value && value.model ? value.model.schema : {})

  function onChangeModel(e) {
    value.model = $backendUiStore.models.find(model => model._id === e.target.value)
  }

  function setParsedValue(evt, field) {
    const fieldSchema = value.model.schema[field]
    if (fieldSchema.type === "number") {
      value[field] = parseInt(evt.target.value)
      return
    }
    value[field] = evt.target.value
  }
</script>

<div class="block-field">
  <select class="budibase__input" value={modelId} on:blur={onChangeModel} on:change={onChangeModel}>
    <option value="">Choose an option</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </select>
</div>

{#if schemaFields.length}
  <div class="bb-margin-xl block-field">
    <Label small forAttr={'fields'}>Fields</Label>
    {#each schemaFields as field}
      <div class="bb-margin-xl">
        <Input thin value={value[field]} label={field} on:change={e => setParsedValue(e, field)} />
      </div>
    {/each}
  </div>
{/if}
