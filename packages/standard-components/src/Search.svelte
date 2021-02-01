<script>
  import { getContext } from "svelte"
  import { isEmpty } from "lodash/fp"
  import { Button, Label, Select, Toggle, Input } from "@budibase/bbui"

  const { API, styleable, DataProvider, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let datasource = []

  let rows = []
  let loaded = false
  let table
  let searchableFields = []
  let search = {}

  $: schema = table?.schema || {}
  $: searchableFields = Object.keys(schema).filter(
    key => schema[key].searchable
  )

  $: console.log(search)

  $: fetchData(datasource)

  async function fetchData(datasource) {
    if (!isEmpty(datasource)) {
      table = await API.fetchTableDefinition(datasource.tableId)
      rows = await API.fetchDatasource({
        ...datasource,
        search
      })
    }
    loaded = true
  }
</script>

<div use:styleable={$component.styles}>
  <div class="query-builder">
    {#each searchableFields as field}
      <div class="form-field">
        <Label extraSmall grey>{schema[field].name}</Label>
        {#if schema[field].type === 'options'}
          <Select secondary bind:value={search[field]}>
            <option value="">Choose an option</option>
            {#each schema[field].constraints.inclusion as opt}
              <option>{opt}</option>
            {/each}
          </Select>
          <!-- {:else if schema[field].type === 'datetime'}
          <DatePicker bind:value={search[field]} /> --->
        {:else if schema[field].type === 'boolean'}
          <Toggle
            text={schema[field].name}
            bind:checked={search[field]} />
        {:else if schema[field].type === 'number'}
          <Input type="number" bind:value={search[field]} />
        {:else if schema[field].type === 'string'}
          <Input bind:value={search[field]} />
        {/if}
      </div>
    {/each}
    <Button blue on:click={() => fetchData(datasource)}>Search</Button>
    <Button red on:click={() => {
      search = {}
      fetchData(datasource)
    }}>Reset</Button>
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
  {/if}
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
</style>
