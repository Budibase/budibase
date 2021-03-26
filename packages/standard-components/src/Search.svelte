<script>
  import { getContext } from "svelte"
  import {
    Button,
    DatePicker,
    Label,
    Select,
    Toggle,
    Input,
  } from "@budibase/bbui"

  const { API, styleable, Provider, builderStore, ActionTypes } = getContext(
    "sdk"
  )
  const component = getContext("component")

  export let table
  export let columns = []
  export let pageSize
  export let noRowsMessage

  let rows = []
  let loaded = false
  let search = {}
  let tableDefinition
  let schema

  let nextBookmark = null
  let bookmark = null
  let lastBookmark = null

  $: fetchData(table, bookmark)
  // omit empty strings
  $: parsedSearch = Object.keys(search).reduce(
    (acc, next) =>
      search[next] === "" ? acc : { ...acc, [next]: search[next] },
    {}
  )
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchData(table, bookmark),
      metadata: { datasource: { type: "table", tableId: table } },
    },
  ]

  async function fetchData(table, mark) {
    if (table) {
      const tableDef = await API.fetchTableDefinition(table)
      schema = tableDef.schema
      const output = await API.searchTableData({
        tableId: table,
        search: parsedSearch,
        pagination: {
          pageSize,
          bookmark: mark,
        },
      })
      rows = output.rows
      nextBookmark = output.bookmark
    }
    loaded = true
  }

  function nextPage() {
    lastBookmark = bookmark
    bookmark = nextBookmark
  }

  function previousPage() {
    nextBookmark = bookmark
    if (lastBookmark !== bookmark) {
      bookmark = lastBookmark
    } else {
      // special case for going back to beginning
      bookmark = null
      lastBookmark = null
    }
  }
</script>

<Provider {actions}>
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
            bookmark = null
          }}>
          Reset
        </Button>
        <Button
          primary
          on:click={() => {
            bookmark = null
            fetchData(table, bookmark)
          }}>
          Search
        </Button>
      </div>
    </div>
    {#if loaded}
      {#if rows.length > 0}
        {#if $component.children === 0 && $builderStore.inBuilder}
          <p><i class="ri-image-line" />Add some components to display.</p>
        {:else}
          {#each rows as row}
            <Provider data={row}>
              <slot />
            </Provider>
          {/each}
        {/if}
      {:else if noRowsMessage}
        <p><i class="ri-search-2-line" />{noRowsMessage}</p>
      {/if}
    {/if}
    <div class="pagination">
      {#if lastBookmark != null || bookmark != null}
        <Button primary on:click={previousPage}>Back</Button>
      {/if}
      {#if nextBookmark != null}
        <Button primary on:click={nextPage}>Next</Button>
      {/if}
    </div>
  </div>
</Provider>

<style>
  p {
    margin: 0 var(--spacing-m);
    background-color: var(--grey-2);
    color: var(--grey-6);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    border-radius: var(--border-radius-s);
    display: grid;
    place-items: center;
  }
  p i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--grey-5);
  }

  .query-builder {
    padding: var(--spacing-m);
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
