<script>
  import { Select, Layout, Input, Checkbox } from "@budibase/bbui"
  import { datasources, integrations, queries } from "stores/backend"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import { _ as t } from "svelte-i18n"

  export let parameters
  export let bindings = []

  $: query = $queries.list.find(q => q._id === parameters.queryId)
  $: datasource = $datasources.list.find(
    ds => ds._id === parameters.datasourceId
  )

  function fetchQueryDefinition(query) {
    const source = $datasources.list.find(
      ds => ds._id === query.datasourceId
    ).source
    return $integrations[source].query[query.queryVerb]
  }
</script>

<Layout gap="XS" noPadding>
  <Select
    label={ $t('datasource') }
    bind:value={parameters.datasourceId}
    options={$datasources.list}
    getOptionLabel={source => source.name}
    getOptionValue={source => source._id}
  />

  {#if parameters.datasourceId}
    <Select
      label={ $t('query') }
      bind:value={parameters.queryId}
      options={$queries.list.filter(
        query => query.datasourceId === datasource._id
      )}
      getOptionLabel={query => query.name}
      getOptionValue={query => query._id}
    />

    {#if parameters.queryId}
      <Checkbox text={ $t('require-confirmation') } bind:value={parameters.confirm} />

      {#if parameters.confirm}
        <Input
          label={ $t('confirm-text') }
          placeholder={ $t('are-you-sure-you-want-to-execute-this-query') }
          bind:value={parameters.confirmText}
        />
      {/if}

      {#if query?.parameters?.length > 0}
        <div>
          <ParameterBuilder
            bind:customParams={parameters.queryParams}
            parameters={query.parameters}
            {bindings}
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
