<script>
  import { getContext } from "svelte"
  import { isEmpty } from "lodash/fp"
  import {
    Button,
    DatePicker,
    Label,
    Select,
    Toggle,
    Input,
  } from "@budibase/bbui"

  const { API, styleable, DataProvider, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let table = []
  export let columns = []
  export let pageSize = 50
  export let noRowsMessage = "No Rows"

  let rows = []
  let loaded = false
  let search = {}
  let tableDefinition
  let schema

  // pagination
  let page = 0

  $: fetchData(table, page)
  $: searchable = [...(table.indexes || []), ...columns]
  // omit empty strings
  $: parsedSearch = Object.keys(search).reduce(
    (acc, next) =>
      search[next] === "" ? acc : { ...acc, [next]: search[next] },
    {}
  )

  async function fetchData(table, page) {
    if (!isEmpty(table)) {
      const tableDef = await API.fetchTableDefinition(table)
      schema = tableDef.schema
      rows = await API.searchTable({
        tableId: table,
        search: parsedSearch,
        pagination: {
          pageSize,
          page,
        },
      })
    }
    loaded = true
  }

  function nextPage() {
    page += 1
  }

  function previousPage() {
    page -= 1
  }
</script>

<div use:styleable={$component.styles}>
  <div class="query-builder">
    {#if schema}
      {#each columns as field}
        <div class="form-field">
          <Label extraSmall grey>{schema[field].name}</Label>
          {#if schema[field].type === 'options'}
            <Select secondary bind:value={search[field]}>
              <option value="">Choose an option</option>
              {#each schema[field].constraints.inclusion as opt}
                <option>{opt}</option>
              {/each}
            </Select>
          {:else if schema[field].type === 'datetime'}
            <DatePicker bind:value={search[field]} />
          {:else if schema[field].type === 'boolean'}
            <Toggle text={schema[field].name} bind:checked={search[field]} />
          {:else if schema[field].type === 'number'}
            <Input type="number" bind:value={search[field]} />
          {:else if schema[field].type === 'string'}
            <Input bind:value={search[field]} />
          {/if}
        </div>
      {/each}
    {/if}
    <div class="actions">
      <Button
        secondary
        on:click={() => {
          search = {}
          page = 0
        }}>
        Reset
      </Button>
      <Button primary on:click={() => fetchData(table)}>Search</Button>
    </div>
  </div>
  {#if rows.length > 0}
    {#if $component.children === 0 && $builderStore.inBuilder}
      <p>Add some components too</p>
    {:else}
      {#each rows as row}
        <DataProvider {row}>
          <slot />
        </DataProvider>
      {/each}
    {/if}
  {:else if loaded && $builderStore.inBuilder}
    <p>Feed me some data</p>
  {:else}
    <p>{noRowsMessage}</p>
  {/if}
  <div class="pagination">
    <!-- <Button primary on:click={previousPage}>First</Button> -->
    {#if page > 0}
      <Button primary on:click={previousPage}>Back</Button>
    {/if}
    {#if rows.length === pageSize}
      <Button primary on:click={nextPage}>Next</Button>
    {/if}
    <!-- <Button primary on:click={previousPage}>Last</Button> -->
  </div>
</div>

<style>
  p {
    display: grid;
    place-items: center;
    background: #f5f5f5;
    border: #ccc 1px solid;
    padding: var(--spacing-m);
  }

  .query-builder {
    padding: var(--spacing-m);
    background: var(--background);
    border-radius: var(--border-radius-s);
  }

  .actions {
    display: grid;
    grid-gap: var(--spacing-s);
    justify-content: flex-end;
    grid-auto-flow: column;
  }

  .form-field {
    margin-bottom: var(--spacing-m);
  }

  .pagination {
    display: grid;
    grid-gap: var(--spacing-s);
    justify-content: flex-end;
    margin-top: var(--spacing-m);
    grid-auto-flow: column;
  }
</style>
