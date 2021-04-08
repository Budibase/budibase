<script>
  import { getBindableProperties } from "builderStore/dataBinding"
  import {
    Button,
    Icon,
    DropdownMenu,
    Spacer,
    Heading,
    Drawer,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store, currentAsset } from "builderStore"
  import {
    tables as tablesStore,
    queries as queriesStore,
  } from "stores/backend"
  import { datasources, integrations } from "stores/backend"
  import { notifier } from "builderStore/store/notifications"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"

  const dispatch = createEventDispatcher()
  let anchorRight, dropdownRight
  let drawer

  export let value = {}
  export let otherSources
  export let showAllQueries

  $: tables = $tablesStore.list.map(m => ({
    label: m.name,
    tableId: m._id,
    type: "table",
  }))
  $: views = $tablesStore.list.reduce((acc, cur) => {
    let viewsArr = Object.entries(cur.views).map(([key, value]) => ({
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
    const source = $datasources.list.find(ds => ds._id === query.datasourceId)
      .source
    return $integrations[source].query[query.queryVerb]
  }
</script>

<div class="container">
  <div
    class="dropdownbutton"
    bind:this={anchorRight}
    on:click={dropdownRight.show}>
    <span>{value?.label ?? 'Choose option'}</span>
    <Icon name="arrowdown" />
  </div>
  {#if value?.type === 'query'}
    <i class="ri-settings-5-line" on:click={drawer.show} />
    <Drawer title={'Query Parameters'} bind:this={drawer}>
      <div slot="buttons">
        <Button
          blue
          thin
          on:click={() => {
            notifier.success('Query parameters saved.')
            handleSelected(value)
            drawer.hide()
          }}>
          Save
        </Button>
      </div>
      <div class="drawer-contents" slot="body">
        {#if value.parameters.length > 0}
          <ParameterBuilder
            bind:customParams={value.queryParams}
            parameters={queries.find(query => query._id === value._id).parameters}
            bindings={queryBindableProperties} />
        {/if}
        <!--        <Spacer large />-->
        <IntegrationQueryEditor
          height={200}
          query={value}
          schema={fetchQueryDefinition(value)}
          datasource={$datasources.list.find(ds => ds._id === value.datasourceId)}
          editable={false} />
        <Spacer large />
      </div>
    </Drawer>
  {/if}
</div>
<DropdownMenu bind:this={dropdownRight} anchor={anchorRight}>
  <div class="dropdown">
    <div class="title">
      <Heading extraSmall>Tables</Heading>
    </div>
    <ul>
      {#each tables as table}
        <li
          class:selected={value === table}
          on:click={() => handleSelected(table)}>
          {table.label}
        </li>
      {/each}
    </ul>
    <hr />
    <div class="title">
      <Heading extraSmall>Views</Heading>
    </div>
    <ul>
      {#each views as view}
        <li
          class:selected={value === view}
          on:click={() => handleSelected(view)}>
          {view.label}
        </li>
      {/each}
    </ul>
    <hr />
    <div class="title">
      <Heading extraSmall>Relationships</Heading>
    </div>
    <ul>
      {#each links as link}
        <li
          class:selected={value === link}
          on:click={() => handleSelected(link)}>
          {link.label}
        </li>
      {/each}
    </ul>

    <hr />
    <div class="title">
      <Heading extraSmall>Queries</Heading>
    </div>
    <ul>
      {#each queries as query}
        <li
          class:selected={value === query}
          on:click={() => handleSelected(query)}>
          {query.label}
        </li>
      {/each}
    </ul>

    {#if otherSources?.length}
      <hr />
      <div class="title">
        <Heading extraSmall>Other</Heading>
      </div>
      <ul>
        {#each otherSources as source}
          <li
            class:selected={value === source}
            on:click={() => handleSelected(source)}>
            {source.label}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</DropdownMenu>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .dropdownbutton {
    background-color: var(--grey-2);
    border: var(--border-transparent);
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: var(--border-radius-m);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    flex: 1 1 auto;
  }
  .dropdownbutton:hover {
    cursor: pointer;
    background-color: var(--grey-3);
  }
  .dropdownbutton span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1 1 auto;
    text-align: left;
    font-size: var(--font-size-xs);
  }
  .dropdownbutton :global(svg) {
    margin: -4px 0;
  }

  .dropdown {
    padding: var(--spacing-m) 0;
    z-index: 99999999;
  }
  .title {
    padding: 0 var(--spacing-m) var(--spacing-xs) var(--spacing-m);
  }

  hr {
    margin: var(--spacing-m) 0 var(--spacing-xl) 0;
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
    font-size: var(--font-size-xs);
  }

  .selected {
    background-color: var(--grey-4);
  }

  li:hover {
    background-color: var(--grey-4);
  }

  .drawer-contents {
    padding: var(--spacing-l);
    height: calc(40vh - 2 * var(--spacing-l));
    overflow-y: auto;
  }

  i {
    margin-left: 5px;
    display: flex;
    align-items: center;
    transition: all 0.2s;
  }

  i:hover {
    transform: scale(1.1);
    font-weight: 500;
    cursor: pointer;
  }
</style>
