<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import SaveFields from "./SaveFields.svelte"

  export let parameters

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.currentComponentInfo._id,
    components: $store.components,
    screen: $store.currentPreviewItem,
    models: $backendUiStore.models,
  })

  // just wraps binding in {{ ... }}
  const toBindingExpression = bindingPath => `{{ ${bindingPath} }}`

  const modelFields = modelId => {
    const model = $backendUiStore.models.find(m => m._id === modelId)

    return Object.keys(model.schema).map(k => ({
      name: k,
      type: model.schema[k].type,
    }))
  }

  $: schemaFields = parameters && parameters.modelId ? modelFields(parameters.modelId) : []

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  <Label size="m" color="dark">Table</Label>
  <Select secondary bind:value={parameters.modelId}>
    <option value="" />
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </Select>

  {#if parameters.modelId}
    <SaveFields parameterFields={parameters.fields} {schemaFields} on:fieldschanged={onFieldsChanged} />
  {/if}

</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-s);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: baseline;
  }

  .root :global(.relative:nth-child(2)) {
    grid-column-start: 2;
    grid-column-end: 6;
  }

  .cannot-use {
    color: var(--red);
    font-size: var(--font-size-s);
    text-align: center;
    width: 70%;
    margin: auto;
  }
</style>
