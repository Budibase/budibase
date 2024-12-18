<script>
  import { Select, Layout, Checkbox } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { datasources, integrations, queries } from "@/stores/builder"
  import BindingBuilder from "@/components/integration/QueryBindingBuilder.svelte"
  import IntegrationQueryEditor from "@/components/integration/index.svelte"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
  } from "@/constants/backend"

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
    {#if parameters.queryId}
      <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

      {#if parameters.confirm}
        <div class="params">
          <DrawerBindableInput
            label="Title"
            placeholder="Prompt User"
            value={parameters.customTitleText}
            on:change={e => (parameters.customTitleText = e.detail)}
            {bindings}
          />
          <DrawerBindableInput
            label="Message"
            placeholder="Are you sure you want to continue?"
            value={parameters.confirmText}
            on:change={e => (parameters.confirmText = e.detail)}
            {bindings}
          />

          <DrawerBindableInput
            label="Confirm Text"
            placeholder="Confirm"
            value={parameters.confirmButtonText}
            on:change={e => (parameters.confirmButtonText = e.detail)}
            {bindings}
          />

          <DrawerBindableInput
            label="Cancel Text"
            placeholder="Cancel"
            value={parameters.cancelButtonText}
            on:change={e => (parameters.cancelButtonText = e.detail)}
            {bindings}
          />
        </div>
      {/if}

      {#if query?.parameters?.length > 0}
        <br />
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
