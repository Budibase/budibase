<script>
  import { Select, Label, TextButton } from "@budibase/bbui"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import { CloseCircleIcon } from "components/common/icons"

  export let parameters

  const emptyField = () => ({ name: "", value: "" })

  // this statement initialises fields from parameters.fields
  $: fields =
    fields ||
    (parameters &&
      Object.keys(parameters.fields || { "": "" }).map(name => ({
        name,
        value: (parameters.fields && parameters.fields[name]) || "",
      })))

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.currentComponentInfo._id,
    components: $store.components,
    screen: $store.currentPreviewItem,
    models: $backendUiStore.models,
  })

  let idFields
  $: {
    idFields = bindableProperties.filter(
      bindable =>
        bindable.type === "context" && bindable.runtimeBinding.endsWith("._id")
    )
    // ensure recordId is always defaulted - there is usually only one option
    if (idFields.length > 0 && !parameters.recordId) {
      parameters.recordId = idFields[0].runtimeBinding
    }
  }

  const addField = () => {
    const newFields = fields.filter(f => f.name)
    newFields.push(emptyField())
    fields = newFields
  }

  const bindablePropertyName = prop => {
    if (prop.type === "instance") return prop.instance._instanceName
    return prop.readableBinding.split(".")[
      prop.readableBinding.lastIndexOf(".")
    ]
  }

  const fieldNameChanged = e => {}

  const rebuildParameters = () => {
    // rebuilds paramters.fields every time a field name or value is added
    parameters.fields = {}
    for (let field of fields) {
      if (field.name) {
        parameters.fields[field.name] = field.value
      }
    }
  }

  // just wraps binding in {{ ... }}
  const toBindingExpression = bindingPath => `{{ ${bindingPath} }}`

  // finds the selected idBinding, then reads the table/view
  // from the component instance that it belongs to.
  // then returns the field names for that schema
  const fieldNamesFromIdBinding = recordId => {
    if (!recordId) return []

    const idBinding = bindableProperties.find(
      prop => prop.runtimeBinding === recordId
    )
    if (!idBinding) return []

    const { instance } = idBinding

    const component = $store.components[instance._component]

    // component.context is the name of the prop that holds the modelId
    const modelId = instance[component.context]

    if (!modelId) return []

    const model = $backendUiStore.models.find(
      m => m._id === instance[component.context]
    )

    return Object.keys(model.schema)
  }

  $: fieldNames = parameters ? fieldNamesFromIdBinding(parameters.recordId) : []
</script>

<div class="root">
  {#if idFields.length === 0}
    <div class="cannot-use">
      Update record can only be used within a component that provides data, such
      as a List
    </div>
  {:else}
    <Label size="m" color="dark">Record Id</Label>
    <Select secondary bind:value={parameters.recordId}>
      {#each idFields as idField}
        <option value={toBindingExpression(idField.runtimeBinding)}>
          {idField.readableBinding}
        </option>
      {/each}
    </Select>
  {/if}

  {#if parameters.recordId && fields}
    {#each fields as field}
      <Label size="m" color="dark">Field</Label>
      <Select secondary bind:value={field.name} on:blur={rebuildParameters}>
        <option value="" />
        {#each fieldNames as fieldName}
          <option value={fieldName}>{fieldName}</option>
        {/each}
      </Select>
      <Label size="m" color="dark">Value</Label>
      <Select
        editable
        secondary
        bind:value={field.value}
        on:blur={rebuildParameters}>
        <option value="" />
        {#each bindableProperties as bindableProp}
          <option value={toBindingExpression(bindableProp.readableBinding)}>
            {bindableProp.readableBinding}
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

  .cannot-use {
    color: var(--red);
    font-size: var(--font-size-s);
    text-align: center;
    width: 70%;
    margin: auto;
  }
</style>
