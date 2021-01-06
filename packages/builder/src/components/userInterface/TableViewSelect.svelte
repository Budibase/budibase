<script>
  import { Button, Icon, DropdownMenu, Spacer, Heading } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import fetchBindableProperties from "../../builderStore/fetchBindableProperties"

  const dispatch = createEventDispatcher()
  let anchorRight, dropdownRight

  export let value = {}

  function handleSelected(selected) {
    dispatch("change", selected)
    dropdownRight.hide()
  }

  $: tables = $backendUiStore.tables.map(m => ({
    label: m.name,
    name: `all_${m._id}`,
    tableId: m._id,
    type: "table",
  }))

  $: views = $backendUiStore.tables.reduce((acc, cur) => {
    let viewsArr = Object.entries(cur.views).map(([key, value]) => ({
      label: key,
      name: key,
      ...value,
      type: "view",
    }))
    return [...acc, ...viewsArr]
  }, [])

  $: queries = $backendUiStore.queries.map(query => ({
      label: query.name,
      name: query.name,
      ...query,
      schema: query.schema,
      type: "query",
  }))

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.selectedComponentId,
    components: $store.components,
    screen: $currentAsset,
    tables: $backendUiStore.tables,
  })

  $: links = bindableProperties
    .filter(x => x.fieldSchema?.type === "link")
    .map(property => {
      return {
        providerId: property.instance._id,
        label: property.readableBinding,
        fieldName: property.fieldSchema.name,
        name: `all_${property.fieldSchema.tableId}`,
        tableId: property.fieldSchema.tableId,
        type: "link",
      }
    })
</script>

<div
  class="dropdownbutton"
  bind:this={anchorRight}
  on:click={dropdownRight.show}>
  <span>{value.label ? value.label : 'Table / View / Query'}</span>
  <Icon name="arrowdown" />
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
  </div>
</DropdownMenu>

<style>
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
</style>
