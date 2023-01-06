<script>
  import { writable } from "svelte/store"
  import { setContext, getContext } from "svelte"
  import { Pagination } from "@budibase/bbui"
  import { fetchData, LuceneUtils } from "@budibase/frontend-core"

  export let dataSource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit
  export let paginate

  const { styleable, Provider, ActionTypes, API } = getContext("sdk")
  const component = getContext("component")

  // Update loading state
  const parentLoading = getContext("loading")
  const loading = writable(true)
  setContext("loading", loading)

  // We need to manage our lucene query manually as we want to allow components
  // to extend it
  let queryExtensions = {}
  $: defaultQuery = LuceneUtils.buildLuceneQuery(filter)
  $: query = extendQuery(defaultQuery, queryExtensions)

  // Fetch data and refresh when needed
  $: fetch = createFetch(dataSource, $parentLoading)
  $: updateFetch({
    query,
    sortColumn,
    sortOrder,
    limit,
    paginate,
  })

  // Keep loading context updated
  $: loading.set($parentLoading || !$fetch.loaded)

  // Build our action context
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetch.refresh(),
      metadata: { dataSource },
    },
    {
      type: ActionTypes.AddDataProviderQueryExtension,
      callback: addQueryExtension,
    },
    {
      type: ActionTypes.RemoveDataProviderQueryExtension,
      callback: removeQueryExtension,
    },
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
    info: $fetch.info,
    datasource: dataSource || {},
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
    limit,
  }

  const createFetch = (datasource, parentLoading) => {
    // Return a dummy fetch if parent is still loading. We do this so that we
    // can still properly subscribe to a valid fetch object and check all
    // properties, but we want to avoid fetching the real data until all parents
    // have finished loading.
    // This logic is only needed due to skeleton loaders, as previously we
    // simply blocked component rendering until data was ready.
    if (parentLoading) {
      return fetchData({ API })
    }

    // Otherwise return the real thing
    return fetchData({
      API,
      datasource,
      options: {
        query,
        sortColumn,
        sortOrder,
        limit,
        paginate,
      },
    })
  }

  const updateFetch = opts => {
    // Only update fetch if parents have stopped loading. Otherwise we will
    // trigger a fetch of the real data before parents are ready.
    if (!$parentLoading) {
      fetch.update(opts)
    }
  }

  const addQueryExtension = (key, extension) => {
    if (!key || !extension) {
      return
    }
    queryExtensions = { ...queryExtensions, [key]: extension }
  }

  const removeQueryExtension = key => {
    if (!key) {
      return
    }
    const newQueryExtensions = { ...queryExtensions }
    delete newQueryExtensions[key]
    queryExtensions = newQueryExtensions
  }

  const extendQuery = (defaultQuery, extensions) => {
    const extensionValues = Object.values(extensions || {})
    let extendedQuery = { ...defaultQuery }
    extensionValues.forEach(extension => {
      Object.entries(extension || {}).forEach(([operator, fields]) => {
        extendedQuery[operator] = {
          ...extendedQuery[operator],
          ...fields,
        }
      })
    })
    return extendedQuery
  }
</script>

<div use:styleable={$component.styles} class="container">
  <Provider {actions} data={dataContext}>
    <slot />
    {#if paginate && $fetch.supportsPagination}
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
  </Provider>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--spacing-xl);
  }
</style>
