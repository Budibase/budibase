<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import SaveFields from "./SaveFields.svelte"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/replaceBindings"

  // parameters.contextPath used in the client handler to determine which row to save
  // this could be "data" or "data.parent", "data.parent.parent" etc
  export let parameters

  let idFields
  let schemaFields

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.currentComponentInfo._id,
    components: $store.components,
    screen: $store.currentPreviewItem,
    tables: $backendUiStore.tables,
  })

  $: {
    if (parameters && parameters.contextPath) {
      schemaFields = schemaFromContextPath(parameters.contextPath)
    } else {
      schemaFields = []
    }
  }

  const idBindingToContextPath = id => id.substring(0, id.length - 4)
  const contextPathToId = path => `${path}._id`

  $: {
    idFields = bindableProperties.filter(
      bindable =>
        bindable.type === "context" && bindable.runtimeBinding.endsWith("._id")
    )
    // ensure contextPath is always defaulted - there is usually only one option
    if (idFields.length > 0 && !parameters.contextPath) {
      parameters.contextPath = idBindingToContextPath(
        idFields[0].runtimeBinding
      )
      parameters = parameters
    }
  }

  // just wraps binding in {{ ... }}
  const toBindingExpression = bindingPath => `{{ ${bindingPath} }}`

  // finds the selected idBinding, then reads the table/view
  // from the component instance that it belongs to.
  // then returns the field names for that schema
  const schemaFromContextPath = contextPath => {
    if (!contextPath) return []

    const idBinding = bindableProperties.find(
      prop => prop.runtimeBinding === contextPathToId(contextPath)
    )
    if (!idBinding) return []

    const { instance } = idBinding

    const component = $store.components[instance._component]

    // component.context is the name of the prop that holds the tableId
    const tableInfo = instance[component.context]
    const tableId =
      typeof tableInfo === "string" ? tableInfo : tableInfo.tableId

    if (!tableInfo) return []

    const table = $backendUiStore.tables.find(m => m._id === tableId)
    parameters.tableId = tableId
    return Object.keys(table.schema).map(k => ({
      name: k,
      type: table.schema[k].type,
    }))
  }

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  {#if idFields.length === 0}
    <div class="cannot-use">
      Update row can only be used within a component that provides data, such as
      a List
    </div>
  {:else}
    <Label size="m" color="dark">Datasource</Label>
    <Select secondary bind:value={parameters.contextPath}>
      <option value="" />
      {#each idFields as idField}
        <option value={idBindingToContextPath(idField.runtimeBinding)}>
          {idField.instance._instanceName}
        </option>
      {/each}
    </Select>
  {/if}

  {#if parameters.contextPath}
    <SaveFields
      parameterFields={parameters.fields}
      {schemaFields}
      on:fieldschanged={onFieldsChanged} />
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

  .root :global(> div:nth-child(2)) {
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
