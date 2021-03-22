<script>
  import { Select, Label, Spacer } from "@budibase/bbui"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import { datasources, integrations } from 'builderStore/store/backend/'
  import { getBindableProperties } from "builderStore/dataBinding"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"

  export let parameters

  $: query = $backendUiStore.queries.find(q => q._id === parameters.queryId)
  $: datasource = $datasources.sources.find(
    ds => ds._id === parameters.datasourceId
  )
  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )

  function fetchQueryDefinition(query) {
    const source = $datasources.sources.find(
      ds => ds._id === query.datasourceId
    ).source
    return $integrations[source].query[query.queryVerb]
  }
</script>

<Label small>Datasource</Label>
<Select thin secondary bind:value={parameters.datasourceId}>
  <option value="" />
  {#each $datasources as datasource}
    <option value={datasource._id}>{datasource.name}</option>
  {/each}
</Select>

<Spacer medium />

{#if parameters.datasourceId}
  <Label small>Query</Label>
  <Select thin secondary bind:value={parameters.queryId}>
    <option value="" />
    {#each $backendUiStore.queries.filter(query => query.datasourceId === datasource._id) as query}
      <option value={query._id}>{query.name}</option>
    {/each}
  </Select>
{/if}

<Spacer medium />

{#if query?.parameters?.length > 0}
  <ParameterBuilder
    bind:customParams={parameters.queryParams}
    parameters={query.parameters}
    bindings={bindableProperties} />
  <IntegrationQueryEditor
    height={200}
    {query}
    schema={fetchQueryDefinition(query)}
    editable={false} />
{/if}
