<script>
  import { getContextProviderComponents } from "builderStore/dataBinding"
  import {
    Button,
    Popover,
    Divider,
    Select,
    Layout,
    Heading,
    Drawer,
    DrawerContent,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store, currentAsset } from "builderStore"
  import {
    tables as tablesStore,
    queries as queriesStore,
    viewsV2 as viewsV2Store,
    views as viewsStore,
  } from "stores/backend"
  import { datasources, integrations } from "stores/backend"
  import BindingBuilder from "components/integration/QueryBindingBuilder.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"

  export let value = {}
  export let otherSources
  export let showAllQueries
  export let bindings = []
  export let showDataProviders = true

  const dispatch = createEventDispatcher()
  const arrayTypes = ["attachment", "array"]
  let anchorRight, dropdownRight
  let drawer
  let tmpQueryParams

  $: text = value?.label ?? "Choose an option"
  $: tables = $tablesStore.list.map(m => ({
    label: m.name,
    tableId: m._id,
    type: "table",
  }))
  $: viewsV1 = $viewsStore.list.map(view => ({
    ...view,
    label: view.name,
    type: "view",
  }))
  $: viewsV2 = $viewsV2Store.list.map(view => ({
    ...view,
    label: view.name,
    type: "viewV2",
  }))
  $: views = [...(viewsV1 || []), ...(viewsV2 || [])]
  $: queries = $queriesStore.list
    .filter(q => showAllQueries || q.queryVerb === "read" || q.readable)
    .map(query => ({
      label: query.name,
      name: query.name,
      ...query,
      type: "query",
    }))
  $: contextProviders = getContextProviderComponents(
    $currentAsset,
    $store.selectedComponentId
  )
  $: dataProviders = contextProviders
    .filter(component => component._component?.endsWith("/dataprovider"))
    .map(provider => ({
      label: provider._instanceName,
      name: provider._instanceName,
      providerId: provider._id,
      value: `{{ literal ${safe(provider._id)} }}`,
      type: "provider",
    }))
  $: links = bindings
    // Get only link bindings
    .filter(x => x.fieldSchema?.type === "link")
    // Filter out bindings provided by forms
    .filter(x => !x.component?.endsWith("/form"))
    .map(binding => {
      const { providerId, readableBinding, fieldSchema } = binding || {}
      const { name, tableId } = fieldSchema || {}
      const safeProviderId = safe(providerId)
      return {
        providerId,
        label: readableBinding,
        fieldName: name,
        tableId,
        type: "link",
        // These properties will be enriched by the client library and provide
        // details of the parent row of the relationship field, from context
        rowId: `{{ ${safeProviderId}.${safe("_id")} }}`,
        rowTableId: `{{ ${safeProviderId}.${safe("tableId")} }}`,
      }
    })
  $: fields = bindings
    .filter(x => arrayTypes.includes(x.fieldSchema?.type))
    .map(binding => {
      const { providerId, readableBinding, runtimeBinding } = binding
      const { name, type, tableId } = binding.fieldSchema
      return {
        providerId,
        label: readableBinding,
        fieldName: name,
        fieldType: type,
        tableId,
        type: "field",
        value: `{{ literal ${runtimeBinding} }}`,
      }
    })
  $: jsonArrays = bindings
    .filter(x => x.fieldSchema?.type === "jsonarray")
    .map(binding => {
      const { providerId, readableBinding, runtimeBinding, tableId } = binding
      const { name, type, prefixKeys } = binding.fieldSchema
      return {
        providerId,
        label: readableBinding,
        fieldName: name,
        fieldType: type,
        tableId,
        prefixKeys,
        type: "jsonarray",
        value: `{{ literal ${runtimeBinding} }}`,
      }
    })

  const handleSelected = selected => {
    dispatch("change", selected)
    dropdownRight.hide()
  }

  const fetchQueryDefinition = query => {
    const source = $datasources.list.find(
      ds => ds._id === query.datasourceId
    ).source
    return $integrations[source].query[query.queryVerb]
  }

  const getQueryParams = query => {
    return $queriesStore.list.find(q => q._id === query?._id)?.parameters || []
  }

  const getQueryDatasource = query => {
    return $datasources.list.find(ds => ds._id === query?.datasourceId)
  }

  const openQueryParamsDrawer = () => {
    tmpQueryParams = { ...value.queryParams }
    drawer.show()
  }

  const getQueryValue = queries => {
    return queries.find(q => q._id === value._id) || value
  }

  const saveQueryParams = () => {
    handleSelected({
      ...value,
      queryParams: tmpQueryParams,
    })
    drawer.hide()
  }
</script>

<div class="container" bind:this={anchorRight}>
  <Select
    readonly
    value={text}
    options={[text]}
    on:click={dropdownRight.show}
  />
  {#if value?.type === "query"}
    <i class="ri-settings-5-line" on:click={openQueryParamsDrawer} />
    <Drawer title={"Query Bindings"} bind:this={drawer}>
      <Button slot="buttons" cta on:click={saveQueryParams}>Save</Button>
      <DrawerContent slot="body">
        <Layout noPadding gap="XS">
          {#if getQueryParams(value).length > 0}
            <BindingBuilder
              customParams={tmpQueryParams}
              on:change={v => {
                tmpQueryParams = { ...v.detail }
              }}
              queryBindings={getQueryParams(value)}
              bind:bindings
            />
          {/if}
          <IntegrationQueryEditor
            height={200}
            query={getQueryValue(queries)}
            schema={fetchQueryDefinition(value)}
            datasource={getQueryDatasource(value)}
            editable={false}
          />
        </Layout>
      </DrawerContent>
    </Drawer>
  {/if}
</div>
<Popover bind:this={dropdownRight} anchor={anchorRight}>
  <div class="dropdown">
    <div class="title">
      <Heading size="XS">Tables</Heading>
    </div>
    <ul>
      {#each tables as table}
        <li on:click={() => handleSelected(table)}>{table.label}</li>
      {/each}
    </ul>
    {#if views?.length}
      <Divider />
      <div class="title">
        <Heading size="XS">Views</Heading>
      </div>
      <ul>
        {#each views as view}
          <li on:click={() => handleSelected(view)}>{view.label}</li>
        {/each}
      </ul>
    {/if}
    {#if queries?.length}
      <Divider />
      <div class="title">
        <Heading size="XS">Queries</Heading>
      </div>
      <ul>
        {#each queries as query}
          <li
            class:selected={value === query}
            on:click={() => handleSelected(query)}
          >
            {query.label}
          </li>
        {/each}
      </ul>
    {/if}
    {#if links?.length}
      <Divider />
      <div class="title">
        <Heading size="XS">Relationships</Heading>
      </div>
      <ul>
        {#each links as link}
          <li on:click={() => handleSelected(link)}>{link.label}</li>
        {/each}
      </ul>
    {/if}
    {#if fields?.length}
      <Divider />
      <div class="title">
        <Heading size="XS">Fields</Heading>
      </div>
      <ul>
        {#each fields as field}
          <li on:click={() => handleSelected(field)}>{field.label}</li>
        {/each}
      </ul>
    {/if}
    {#if jsonArrays?.length}
      <Divider />
      <div class="title">
        <Heading size="XS">JSON Arrays</Heading>
      </div>
      <ul>
        {#each jsonArrays as field}
          <li on:click={() => handleSelected(field)}>{field.label}</li>
        {/each}
      </ul>
    {/if}
    {#if showDataProviders && dataProviders?.length}
      <Divider />
      <div class="title">
        <Heading size="XS">Data Providers</Heading>
      </div>
      <ul>
        {#each dataProviders as provider}
          <li
            class:selected={value === provider}
            on:click={() => handleSelected(provider)}
          >
            {provider.label}
          </li>
        {/each}
      </ul>
    {/if}
    {#if otherSources?.length}
      <Divider />
      <div class="title">
        <Heading size="XS">Other</Heading>
      </div>
      <ul>
        {#each otherSources as source}
          <li on:click={() => handleSelected(source)}>{source.label}</li>
        {/each}
      </ul>
    {/if}
  </div>
</Popover>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .container :global(:first-child) {
    flex: 1 1 auto;
  }

  .dropdown {
    padding: var(--spacing-m) 0;
    z-index: 99999999;
    overflow-y: scroll;
  }
  .title {
    padding: 0 var(--spacing-m) var(--spacing-s) var(--spacing-m);
  }

  ul {
    list-style: none;
    padding-left: 0px;
    margin: 0px;
  }

  li {
    cursor: pointer;
    margin: 0px;
    padding: var(--spacing-s) var(--spacing-m);
    font-size: var(--font-size-m);
  }

  .selected {
    color: var(--spectrum-global-color-blue-600);
  }

  li:hover {
    background-color: var(--spectrum-global-color-gray-200);
  }

  i {
    margin-left: 5px;
    display: flex;
    align-items: center;
    transition: all 0.2s;
  }

  i:hover {
    transform: scale(1.1);
    font-weight: 600;
    cursor: pointer;
  }
</style>
