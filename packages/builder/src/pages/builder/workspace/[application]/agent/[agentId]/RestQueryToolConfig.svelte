<script lang="ts">
  import { Heading, Body, Select, Input, Toggle } from "@budibase/bbui"
  import { datasources } from "@/stores/builder"
  import { IntegrationTypes } from "@/constants/backend"
  import { type Query, type AgentToolSourceWithTools } from "@budibase/types"
  import { queries } from "@/stores/builder"

  export let editingSource: AgentToolSourceWithTools | null = null
  export let toggleQuery: (_queryId: string) => void
  export let selectedDatasourceId: string
  export let selectedQueryIds: string[] = []
  export let label: string
  $: restDatasources = ($datasources.list || []).filter(
    ds => ds.source === IntegrationTypes.REST
  )

  $: datasourceOptions = restDatasources.map(ds => ({
    label: ds.name || ds._id!,
    value: ds._id!,
  }))

  $: queriesForDatasource = ($queries.list || []).filter(
    (q: Query) => q.datasourceId === selectedDatasourceId
  )

  function handleDatasourceChange(e: CustomEvent<string>) {
    const newDatasourceId = e.detail
    selectedDatasourceId = newDatasourceId
    if (!newDatasourceId) {
      return
    }

    if (!editingSource) {
      const ds = restDatasources.find(d => d._id === newDatasourceId)
      if (ds) {
        label = ds.name || ""
      }
    }

    const allQueries = ($queries.list || []).filter(
      (q: Query) => q.datasourceId === newDatasourceId
    )
    selectedQueryIds = allQueries
      .map(q => q._id)
      .filter((id): id is string => !!id)
  }
</script>

<div class="rest-query-section">
  <Heading size="XS">Select API</Heading>
  {#if restDatasources.length === 0}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      No REST APIs found. Create a REST API in the APIs section first.
    </Body>
  {:else}
    {#if !editingSource}
      <Select
        label="REST API"
        value={selectedDatasourceId}
        on:change={handleDatasourceChange}
        options={datasourceOptions}
        placeholder="Select a REST API"
      />
    {/if}
    {#if selectedDatasourceId}
      <Input
        label="Tool Source Name"
        bind:value={label}
        placeholder="e.g. GitHub, Confluence, Jira"
      />
      <div class="queries-section">
        <Heading size="XS">Select queries</Heading>
        {#if queriesForDatasource.length === 0}
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            No actions found for this API. Create actions in the APIs section
            first.
          </Body>
        {:else}
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            Select which queries the agent can use as tools.
          </Body>
          <div class="queries-list">
            {#each queriesForDatasource as query}
              <div class="query-item">
                <div class="query-info">
                  <div class="query-name">{query.name}</div>
                </div>
                <Toggle
                  value={selectedQueryIds.includes(query._id || "")}
                  on:change={() => toggleQuery(query._id || "")}
                />
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .rest-query-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .queries-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-top: var(--spacing-m);
  }

  .queries-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 4px;
    padding: var(--spacing-s);
    max-height: 300px;
    overflow-y: auto;
  }

  .query-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-s);
    border-bottom: 1px solid var(--spectrum-global-color-gray-100);
  }

  .query-item:last-child {
    border-bottom: none;
  }

  .query-info {
    flex: 1;
    margin-right: var(--spacing-m);
  }

  .query-name {
    font-weight: 600;
    font-size: var(--font-size-s);
  }
</style>
