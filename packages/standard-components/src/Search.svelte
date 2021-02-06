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
  export let noRowsMessage = "Feed me some data"

  let rows = []
  let loaded = false
  // let searchableFields = []
  let search = {}
  let tableDefinition
  let schema = {}
  let page = 1

  $: columns = Object.keys(schema).filter(key => schema[key].searchable)
  $: cursor = rows[rows.length - 1]?._id
  $: page && fetchData(table)

  async function fetchData(table) {
    if (!isEmpty(table)) {
      const tableDef = await API.fetchTableDefinition(table)
      schema = tableDef.schema
      rows = await API.searchTable({
        tableId: table,
        search,
        pageSize,
        cursor,
      })
    }
    loaded = true
  }

</script>

<div use:styleable={$component.styles}>
  <div class="query-builder">
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
    <Button blue on:click={() => fetchData(table)}>Search</Button>
    <Button
      red
      on:click={() => {
        search = {}
        fetchData(table)
      }}>
      Reset
    </Button>
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
    <p>{noRowsMessage}</p>
  {/if}
  <div class="pagination">
    {#if page > 1}
      <Button blue on:click={() => (page -= 1)}>Back</Button>
    {/if}
    <Button blue on:click={() => (page += 1)}>Next</Button>
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

  .form-field {
    margin-bottom: var(--spacing-m);
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-m);
  }
</style>
