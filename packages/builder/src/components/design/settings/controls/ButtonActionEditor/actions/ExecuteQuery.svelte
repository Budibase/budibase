<script>
  import { _ } from "../../../../../../../lang/i18n"

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
    label={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.ExecuteQuery.Datasource"
    )}
    bind:value={parameters.datasourceId}
    options={executeQueryDatasources}
    getOptionLabel={source => source.name}
    getOptionValue={source => source._id}
  />

  {#if parameters.datasourceId}
    <Select
      label={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.ExecuteQuery.Query"
      )}
      bind:value={parameters.queryId}
      options={$queries.list.filter(
        query => query.datasourceId === datasource._id
      )}
      getOptionLabel={query => query.name}
      getOptionValue={query => query._id}
    />
    <Checkbox
      text={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.ExecuteQuery.not_display"
      )}
      bind:value={parameters.notificationOverride}
    />
    <br />
    {#if parameters.queryId}
      <Checkbox
        text={$_(
          "components.design.settings.controls.ButtonActionEditor.actions.ExecuteQuery.Require_confirmation"
        )}
        bind:value={parameters.confirm}
      />

      {#if parameters.confirm}
        <Input
          label={$_(
            "components.design.settings.controls.ButtonActionEditor.actions.ExecuteQuery.Confirm_text"
          )}
          placeholder={$_(
            "components.design.settings.controls.ButtonActionEditor.actions.ExecuteQuery.want_execute"
          )}
          bind:value={parameters.confirmText}
        />
      {/if}

      {#if query?.parameters?.length > 0}
        <div class="params">
          <BindingBuilder
            bind:customParams={parameters.queryParams}
            queryBindings={query.parameters}
            bind:bindings
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
