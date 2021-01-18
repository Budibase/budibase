<script>
  import { Select, Label, Spacer } from "@budibase/bbui"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import ParameterBuilder from "../../../integration/QueryParameterBuilder.svelte"

  export let parameters

  $: datasource = $backendUiStore.datasources.find(
    ds => ds._id === parameters.datasourceId
  )
  // TODO: binding needs to be centralised
  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.selectedComponentId,
    components: $store.components,
    screen: $currentAsset,
    tables: $backendUiStore.tables,
    queries: $backendUiStore.queries
  }).map(property => ({
    ...property,
    category: property.type === "instance" ? "Component" : "Table",
    label: property.readableBinding,
    path: property.readableBinding,
  }))

  $: query =
    parameters.queryId &&
    $backendUiStore.queries.find(query => query._id === parameters.queryId)
</script>

<div class="root">
  <Label size="m" color="dark">Datasource</Label>
  <Select thin secondary bind:value={parameters.datasourceId}>
    <option value="" />
    {#each $backendUiStore.datasources as datasource}
      <option value={datasource._id}>{datasource.name}</option>
    {/each}
  </Select>

  <Spacer medium />

  {#if parameters.datasourceId}
    <Label size="m" color="dark">Query</Label>
    <Select thin secondary bind:value={parameters.queryId}>
      <option value="" />
      {#each $backendUiStore.queries.filter(query => query.datasourceId === datasource._id) as query}
        <option value={query._id}>{query.name}</option>
      {/each}
    </Select>
  {/if}

  <Spacer medium />

  {#if query?.parameters.length > 0}
    <ParameterBuilder
      bind:customParams={parameters.queryParams}
      parameters={query.parameters}
      bindings={bindableProperties} />
    {#if query.fields.sql}
      <pre>{query.fields.queryString}</pre>
    {/if}
  {/if}
</div>

<style>
  .root {
    padding: var(--spacing-m);
  }
</style>
