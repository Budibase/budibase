<script>
  import { Select, Label, Spacer } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"

  export let parameters

  $: datasource = $backendUiStore.datasources.find(
    ds => ds._id === parameters.datasourceId
  )
</script>

<div class="root">
  <Label size="m" color="dark">Datasource</Label>
  <Select secondary bind:value={parameters.datasourceId}>
    <option value="" />
    {#each $backendUiStore.datasources as datasource}
      <option value={datasource._id}>{datasource.name}</option>
    {/each}
  </Select>

  <Spacer medium />

  {#if parameters.datasourceId}
    <Label size="m" color="dark">Query</Label>
    <Select secondary bind:value={parameters.queryId}>
      <option value="" />
      {#each $backendUiStore.queries.filter(query => query.datasourceId === datasource._id) as query}
        <option value={query._id}>{query.name}</option>
      {/each}
    </Select>
  {/if}
</div>
