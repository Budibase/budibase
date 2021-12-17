<script>
  import { getContext } from "svelte"
  import { ProgressCircle, Pagination } from "@budibase/bbui"
  import Placeholder from "./Placeholder.svelte"
  import { fetchData } from "utils/fetch/fetchData.js"

  export let dataSource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit
  export let paginate

  const { styleable, Provider, ActionTypes } = getContext("sdk")
  const component = getContext("component")

  $: fetch = createFetch(dataSource)
  $: fetch.update({
    filter,
    sortColumn,
    sortOrder,
    limit,
    paginate,
  })

  // Build our action context
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetch.refresh(),
      metadata: { dataSource },
    },
    // {
    //   type: ActionTypes.AddDataProviderQueryExtension,
    //   callback: addQueryExtension,
    // },
    // {
    //   type: ActionTypes.RemoveDataProviderQueryExtension,
    //   callback: removeQueryExtension,
    // },
    {
      type: ActionTypes.SetDataProviderSorting,
      callback: ({ column, order }) => {
        let newOptions = {}
        if (column) {
          newOptions.sortColumn = column
        }
        if (order) {
          newOptions.sortOrder = order
        }
        if (Object.keys(newOptions)?.length) {
          fetch.update(newOptions)
        }
      },
    },
  ]

  // Build our data context
  $: dataContext = {
    rows: $fetch.rows,
    schema: $fetch.schema,
    rowsLength: $fetch.rows.length,

    // Undocumented properties. These aren't supposed to be used in builder
    // bindings, but are used internally by other components
    id: $component?.id,
    state: {
      query: $fetch.query,
      sortColumn: $fetch.sortColumn,
      sortOrder: $fetch.sortOrder,
    },
    loaded: $fetch.loaded,
  }

  const createFetch = datasource => {
    return fetchData(datasource, {
      filter,
      sortColumn,
      sortOrder,
      limit,
      paginate,
    })
  }
</script>

<div use:styleable={$component.styles} class="container">
  <Provider {actions} data={dataContext}>
    {#if !$fetch.loaded}
      <div class="loading">
        <ProgressCircle />
      </div>
    {:else}
      {#if $component.emptyState}
        <Placeholder />
      {:else}
        <slot />
      {/if}
      {#if paginate && dataSource?.type === "table"}
        <div class="pagination">
          <Pagination
            page={$fetch.pageNumber + 1}
            hasPrevPage={$fetch.hasPrevPage}
            hasNextPage={$fetch.hasNextPage}
            goToPrevPage={fetch.prevPage}
            goToNextPage={fetch.nextPage}
          />
        </div>
      {/if}
    {/if}
  </Provider>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .loading {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--spacing-xl);
  }
</style>
