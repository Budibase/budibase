<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"

  export let parameters

  let idFields

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.selectedComponentId,
    components: $store.components,
    screen: $currentAsset,
    tables: $backendUiStore.tables,
  })

  $: idFields = bindableProperties.filter(
    bindable =>
      bindable.type === "context" && bindable.runtimeBinding.endsWith("._id")
  )

  $: {
    if (parameters.rowId) {
      // Set rev ID
      parameters.revId = parameters.rowId.replace("_id", "_rev")

      // Set table ID
      const idBinding = bindableProperties.find(
        prop =>
          prop.runtimeBinding ===
          parameters.rowId
            .replace("{{", "")
            .replace("}}", "")
            .trim()
      )
      if (idBinding) {
        const { instance } = idBinding
        const component = $store.components[instance._component]
        const tableInfo = instance[component.context]
        if (tableInfo) {
          parameters.tableId =
            typeof tableInfo === "string" ? tableInfo : tableInfo.tableId
        }
      }

      console.log(parameters)
    }
  }
</script>

<div class="root">
  {#if idFields.length === 0}
    <div class="cannot-use">
      Delete row can only be used within a component that provides data, such as
      a List
    </div>
  {:else}
    <Label size="m" color="dark">Datasource</Label>
    <Select secondary bind:value={parameters.rowId}>
      <option value="" />
      {#each idFields as idField}
        <option value={`{{ ${idField.runtimeBinding} }}`}>
          {idField.instance._instanceName}
        </option>
      {/each}
    </Select>
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
