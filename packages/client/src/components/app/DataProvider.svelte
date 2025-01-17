<script lang="ts">
  import { getContext } from "svelte"
  import { Pagination, ProgressCircle } from "@budibase/bbui"
  import { fetchData, QueryUtils } from "@budibase/frontend-core"
  import {
    LogicalOperator,
    EmptyFilterOption,
    TableSchema,
    SortOrder,
    SearchFilters,
    UISearchFilter,
    DataFetchDatasource,
    UserDatasource,
    GroupUserDatasource,
    DataFetchOptions,
  } from "@budibase/types"
  import { SDK, Component } from "../../index"

  type ProviderDatasource = Exclude<
    DataFetchDatasource,
    UserDatasource | GroupUserDatasource
  >

  export let dataSource: ProviderDatasource
  export let filter: UISearchFilter
  export let sortColumn: string
  export let sortOrder: SortOrder
  export let limit: number
  export let paginate: boolean
  export let autoRefresh: number

  const { styleable, Provider, ActionTypes, API } = getContext<SDK>("sdk")
  const component = getContext<Component>("component")

  let interval: ReturnType<typeof setInterval>
  let queryExtensions: Record<string, any> = {}

  $: defaultQuery = QueryUtils.buildQuery(filter)

  // We need to manage our lucene query manually as we want to allow components
  // to extend it
  $: query = extendQuery(defaultQuery, queryExtensions)
  $: fetch = createFetch(dataSource)
  $: fetch.update({
    query,
    sortColumn,
    sortOrder,
    limit,
    paginate,
  })
  $: schema = sanitizeSchema($fetch.schema)
  $: setUpAutoRefresh(autoRefresh)
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
      callback: ({
        column,
        order,
      }: {
        column: string
        order: SortOrder | undefined
      }) => {
        let newOptions: Partial<DataFetchOptions> = {}
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

  $: dataContext = {
    rows: $fetch.rows,
    info: $fetch.info,
    datasource: dataSource || {},
    schema,
    rowsLength: $fetch.rows.length,
    pageNumber: $fetch.pageNumber + 1,
    // Undocumented properties. These aren't supposed to be used in builder
    // bindings, but are used internally by other components
    id: $component?.id,
    state: {
      query: $fetch.query,
    },
    limit,
    primaryDisplay: ($fetch.definition as any)?.primaryDisplay,
  }

  const createFetch = (datasource: ProviderDatasource) => {
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

  const sanitizeSchema = (schema: TableSchema | null) => {
    if (!schema) {
      return schema
    }
    let cloned = { ...schema }
    Object.entries(cloned).forEach(([field, fieldSchema]) => {
      if (fieldSchema.visible === false) {
        delete cloned[field]
      }
    })
    return cloned
  }

  const addQueryExtension = (key: string, extension: any) => {
    if (!key || !extension) {
      return
    }
    queryExtensions = { ...queryExtensions, [key]: extension }
  }

  const removeQueryExtension = (key: string) => {
    if (!key) {
      return
    }
    const newQueryExtensions = { ...queryExtensions }
    delete newQueryExtensions[key]
    queryExtensions = newQueryExtensions
  }

  const extendQuery = (
    defaultQuery: SearchFilters,
    extensions: Record<string, any>
  ): SearchFilters => {
    if (!Object.keys(extensions).length) {
      return defaultQuery
    }
    const extended: SearchFilters = {
      [LogicalOperator.AND]: {
        conditions: [
          ...(defaultQuery ? [defaultQuery] : []),
          ...Object.values(extensions || {}),
        ],
      },
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
    }

    // If there are no conditions applied at all, clear the request.
    return (extended[LogicalOperator.AND]?.conditions?.length ?? 0) > 0
      ? extended
      : {}
  }

  const setUpAutoRefresh = (autoRefresh: number) => {
    clearInterval(interval)
    if (autoRefresh) {
      interval = setInterval(fetch.refresh, Math.max(10000, autoRefresh * 1000))
    }
  }
</script>

<div use:styleable={$component.styles} class="container">
  <Provider {actions} data={dataContext}>
    {#if !$fetch.loaded}
      <div class="loading">
        <ProgressCircle />
      </div>
    {:else}
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
