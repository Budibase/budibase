<script>
  import { Select, Layout, Input, Checkbox } from "@budibase/bbui"
  import { datasources, integrations, queries } from "stores/backend"
  import BindingBuilder from "components/integration/QueryBindingBuilder.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
  } from "constants/backend"

  export let parameters
  export let bindings = []

  $: query = $queries.list.find(q => q._id === parameters.queryId)
  $: datasource = $datasources.list.find(
    ds => ds._id === parameters.datasourceId
  )
  // Executequery must exclude budibase datasource
  $: executeQueryDatasources = $datasources.list.filter(
    x =>
      x._id !== BUDIBASE_INTERNAL_DB_ID && x.type !== BUDIBASE_DATASOURCE_TYPE
  )
  // Ensure query params exist so they can be bound
  $: {
    if (!parameters.queryParams) {
      parameters.queryParams = {}
    }
  }

  function fetchQueryDefinition(query) {
    const source = $datasources.list.find(
      ds => ds._id === query.datasourceId
    ).source
    return $integrations[source].query[query.queryVerb]
  }
</script>

<Layout gap="XS" noPadding>
  <Select
    label="Datasource"
    bind:value={parameters.datasourceId}
    options={executeQueryDatasources}
    getOptionLabel={source => source.name}
    getOptionValue={source => source._id}
  />

  {#if parameters.datasourceId}
    <Select
      label="Query"
      bind:value={parameters.queryId}
      options={$queries.list.filter(
        query => query.datasourceId === datasource._id
      )}
      getOptionLabel={query => query.name}
      getOptionValue={query => query._id}
    />
    <Checkbox
      text="Do not display default notification"
      bind:value={parameters.notificationOverride}
    />
    <br />
    {#if parameters.queryId}
      <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

      {#if parameters.confirm}
        <Input
          label="Confirm text"
          placeholder="Are you sure you want to execute this query?"
          bind:value={parameters.confirmText}
        />
      {/if}

      {#if query?.parameters?.length > 0}
        <div class="params">
          <BindingBuilder
            customParams={parameters.queryParams}
            queryBindings={query.parameters}
            bind:bindings
            on:change={v => {
              parameters.queryParams = { ...v.detail }
            }}
          />
          <IntegrationQueryEditor
            height={200}
            {query}
            schema={fetchQueryDefinition(query)}
            editable={false}
            {datasource}
          />
        </div>
      {/if}
    {/if}
  {/if}
</Layout>

<style>
  .params {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
</style>
