<script>
  import { backendUiStore } from "builderStore"
  import { Input, Label } from "@budibase/bbui"

  export let value
  $: value = value || {}
  $: model = $backendUiStore.models.find(model => model._id === value?.modelId)
  $: schemaFields = Object.keys(model?.schema ?? {})

  function setParsedValue(evt, field) {
    const fieldSchema = model?.schema[field]
    if (fieldSchema) {
      if (fieldSchema.type === "number") {
        value[field] = parseInt(evt.target.value)
        return
      }
    }
    value[field] = evt.target.value
  }
</script>

<div class="block-field">
  <select class="budibase__input" bind:value={value.modelId}>
    <option value="">Choose an option</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </select>
</div>

{#if schemaFields.length}
  <div class="bb-margin-xl block-field">
    {#each schemaFields as field}
      <div class="bb-margin-xl capitalise">
        <Input
          thin
          value={value[field]}
          label={field}
          on:change={e => setParsedValue(e, field)} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .capitalise :global(label) {
    text-transform: capitalize !important;
  }
</style>
