<script>
  import { getContext } from "svelte"
  import { isEmpty } from "lodash/fp"

  export let datasource
  export let noRowsMessage
  export let filter

  const { API, styleable, Provider, builderStore, ActionTypes } = getContext(
    "sdk"
  )
  const component = getContext("component")
  let rows = []
  let loaded = false

  $: fetchData(datasource)
  $: filteredRows = filterRows(rows, filter)
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchData(datasource),
      metadata: { datasource },
    },
  ]

  const fetchData = async datasource => {
    if (!isEmpty(datasource)) {
      rows = await API.fetchDatasource(datasource)
    }
    loaded = true
  }

  const filterRows = (rows, filter) => {
    if (!Object.keys(filter || {}).length) {
      return rows
    }
    let filteredData = [...rows]
    Object.keys(filter).forEach(field => {
      if (filter[field].value != null && filter[field].value !== "") {
        filteredData = filteredData.filter(row => {
          return row[field] === filter[field].value
        })
      }
    })
    return filteredData
  }
</script>

<Provider {actions}>
  <div use:styleable={$component.styles}>
    {#if filteredRows.length > 0}
      {#if $component.children === 0 && $builderStore.inBuilder}
        <p><i class="ri-image-line" />Add some components to display.</p>
      {:else}
        {#each filteredRows as row}
          <Provider data={row}>
            <slot />
          </Provider>
        {/each}
      {/if}
    {:else if loaded && noRowsMessage}
      <p><i class="ri-list-check-2" />{noRowsMessage}</p>
    {/if}
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
</style>
