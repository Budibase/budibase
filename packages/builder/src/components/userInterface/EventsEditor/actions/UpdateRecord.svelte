<script>
  import { Select, Label, TextButton } from "@budibase/bbui"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import { CloseCircleIcon } from "components/common/icons"

  export let parameters

  const emptyField = () => ({ name: "", value: "" })

  $: fields = Object.keys(parameters.fields || emptyField()).map(name => ({
    name,
    value: (parameters.fields && parameters.fields[name]) || "",
  }))

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.currentComponentInfo._id,
    components: $store.components,
    screen: $store.currentPreviewItem,
    models: $backendUiStore.models,
  })

  const addField = () => {
    const newFields = fields.filter(f => f.name)
    newFields.push(emptyField())
    fields = newFields
  }

  const bindablePropertyName = prop => {
    if (prop.type === "instance") return prop.instance._instanceName
    return instance.readableBinding.split(".")[
      instance.readableBinding.lastIndexOf(".")
    ]
  }

  let fieldNames
  $: {
    fieldNames =
      parameters.model &&
      Object.keys(
        $backendUiStore.models.find(model => model._id === parameters.model)
          .schema
      )
  }
</script>

<div class="root">
  <Label size="m" color="dark">Table</Label>
  <Select secondary bind:value={parameters.model}>
    <option value="" />
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </Select>

  {#if parameters.model && fields}
    {#each fields as field}
      <Label size="m" color="dark">Field</Label>
      <Select secondary bind:value={field.name}>
        <option value="" />
        {#each fieldNames as fieldName}
          <option value={fieldName}>{fieldName}</option>
        {/each}
      </Select>
      <Label size="m" color="dark">Value</Label>
      <Select secondary bind:value={field.value}>
        <option value="" />
        {#each bindableProperties as bindableProp}
          <option value={bindableProp.runtimeBinding}>
            {bindablePropertyName(bindableProp)}
          </option>
        {/each}
      </Select>
      <div class="remove-field-container">
        <TextButton text small>
          <CloseCircleIcon />
        </TextButton>
      </div>
    {/each}
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

  .remove-field-container :global(button) {
    vertical-align: bottom;
  }
</style>
