<script>
  import {
    getBindableProperties,
    getDataProviderComponents,
  } from "builderStore/dataBinding"
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
  } from "stores/backend"
  import { datasources, integrations } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"

  const dispatch = createEventDispatcher()
  let anchorRight, dropdownRight
  let drawer

  export let value = {}
  export let otherSources
  export let showAllQueries

  $: text = value?.label ?? "Choose an option"
  $: tables = $tablesStore.list.map(m => ({
    label: m.name,
    tableId: m._id,
    type: "table",
  }))
  $: views = $tablesStore.list.reduce((acc, cur) => {
    let viewsArr = Object.entries(cur.views || {}).map(([key, value]) => ({
      label: key,
      name: key,
      ...value,
      type: "view",
    }))
    return [...acc, ...viewsArr]
  }, [])
  $: queries = $queriesStore.list
    .filter(
      query => showAllQueries || query.queryVerb === "read" || query.readable
    )
    .map(query => ({
      label: query.name,
      name: query.name,
      tableId: query._id,
      ...query,
      schema: query.schema,
      parameters: query.parameters,
      type: "query",
    }))
  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )
  $: dataProviders = getDataProviderComponents(
    $currentAsset,
    $store.selectedComponentId
  ).map(provider => ({
    label: provider._instanceName,
    name: provider._instanceName,
    providerId: provider._id,
    value: `{{ literal [${provider._id}] }}`,
    type: "provider",
    schema: provider.schema,
  }))
  $: queryBindableProperties = bindableProperties.map(property => ({
    ...property,
    category: property.type === "instance" ? "Component" : "Table",
    label: property.readableBinding,
    path: property.readableBinding,
  }))
  $: links = bindableProperties
    .filter(x => x.fieldSchema?.type === "link")
    .map(property => {
      return {
        providerId: property.providerId,
        label: property.readableBinding,
        fieldName: property.fieldSchema.name,
        tableId: property.fieldSchema.tableId,
        type: "link",
        // These properties will be enriched by the client library and provide
        // details of the parent row of the relationship field, from context
        rowId: `{{ ${property.providerId}._id }}`,
        rowTableId: `{{ ${property.providerId}.tableId }}`,
      }
    })

  function handleSelected(selected) {
    dispatch("change", selected)
    dropdownRight.hide()
  }

  function fetchQueryDefinition(query) {
    const source = $datasources.list.find(
      ds => ds._id === query.datasourceId
    ).source
    return $integrations[source].query[query.queryVerb]
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
    <i class="ri-settings-5-line" on:click={drawer.show} />
    <Drawer title={"Query Parameters"} bind:this={drawer}>
      <Button
        slot="buttons"
        cta
        on:click={() => {
          notifications.success("Query parameters saved.")
          handleSelected(value)
          drawer.hide()
        }}
      >
        Save
      </Button>
      <DrawerContent slot="body">
        <Layout noPadding>
          {#if value.parameters.length > 0}
            <ParameterBuilder
              bind:customParams={value.queryParams}
              parameters={queries.find(query => query._id === value._id)
                .parameters}
              bindings={queryBindableProperties}
            />
          {/if}
          <IntegrationQueryEditor
            height={200}
            query={value}
            schema={fetchQueryDefinition(value)}
            datasource={$datasources.list.find(
              ds => ds._id === value.datasourceId
            )}
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
    <Divider size="S" />
    <div class="title">
      <Heading size="XS">Views</Heading>
    </div>
    <ul>
      {#each views as view}
        <li on:click={() => handleSelected(view)}>{view.label}</li>
      {/each}
    </ul>
    <Divider size="S" />
    <div class="title">
      <Heading size="XS">Relationships</Heading>
    </div>
    <ul>
      {#each links as link}
        <li on:click={() => handleSelected(link)}>{link.label}</li>
      {/each}
    </ul>
    <Divider size="S" />
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
    <Divider size="S" />
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
    {#if otherSources?.length}
      <Divider size="S" />
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
