<script lang="ts">
  import { Button, Helpers } from "@budibase/bbui"
  import {
    type FilterConfig,
    type FieldSchema,
    type SearchFilter,
    type SearchFilterGroup,
    type TableSchema,
    type UISearchFilter,
    type Component,
    type TableDatasource,
    ArrayOperator,
    EmptyFilterOption,
    FieldType,
    FilterType,
    InternalTable,
    RangeOperator,
    UILogicalOperator,
  } from "@budibase/types"
  import { getContext } from "svelte"
  import Container from "../container/Container.svelte"
  import { getAction } from "@/utils/getAction"
  import { ActionTypes } from "@/constants"
  import { QueryUtils, fetchData, memo } from "@budibase/frontend-core"
  import FilterButton from "./FilterButton.svelte"
  import { onDestroy } from "svelte"
  import { uiStateStore, componentStore } from "@/stores"
  import { onMount, setContext } from "svelte"
  import { writable } from "svelte/store"

  export let persistFilters: boolean | undefined = false
  export let showClear: boolean | undefined = false
  export let filterConfig: FilterConfig[] | undefined = []
  export let targetComponent: any
  export let size: "S" | "M" | "L" = "M"
  export let buttonText: string | undefined = "Apply"

  const memoFilters = memo({} as Record<string, SearchFilter>)
  const component = getContext("component")
  const { API, fetchDatasourceSchema, getRelationshipSchemaAdditions } =
    getContext("sdk")

  const rowCache = writable({})
  setContext("rows", rowCache)

  // Core filter template
  const baseFilter: UISearchFilter = {
    logicalOperator: UILogicalOperator.ALL,
    onEmptyFilter: EmptyFilterOption.RETURN_NONE,
    groups: [
      {
        logicalOperator: UILogicalOperator.ALL, // could be configurable
        filters: [],
      },
    ],
  }

  let userFetch: any
  let hydrated = false

  // All current filters.
  let filters: Record<string, SearchFilter> = {}

  let schema: TableSchema | null

  // Target component being filtered
  let dataComponent: Component | null = null

  // Update the memo when the filters are updated
  $: memoFilters.set(filters)

  // Fully built filter extension
  $: filterExtension = buildExtension($memoFilters)

  $: query = filterExtension ? QueryUtils.buildQuery(filterExtension) : null

  // Embedded datasources are those inside blocks or other components
  $: filterDatasource =
    targetComponent?.embeddedData?.dataSource ?? targetComponent?.datasource

  // The target component
  $: componentId =
    targetComponent?.embeddedData?.componentId ?? targetComponent?.id

  // Process the target component
  $: target = componentStore.actions.getComponentById(componentId)

  // Ensure the target has intialised
  $: loaded =
    (targetComponent?.embeddedData?.loaded ?? targetComponent?.loaded) || false

  // Init the target component
  $: loaded && initTarget(target)

  // Update schema when the target instance
  $: dataComponent && fetchSchema(filterDatasource)

  $: isGridblock =
    dataComponent?._component === "@budibase/standard-components/gridblock"

  // Must be active and part of the current schema
  $: visibleFilters = filterConfig?.filter(
    filter => filter.active && schema?.[filter.field]
  )

  // Choose the appropriate action based on component type
  $: addAction = isGridblock
    ? ActionTypes.AddDataProviderFilterExtension
    : ActionTypes.AddDataProviderQueryExtension
  $: removeAction = isGridblock
    ? ActionTypes.RemoveDataProviderFilterExtension
    : ActionTypes.RemoveDataProviderQueryExtension

  // Register extension actions
  $: addExtension =
    componentId && loaded ? getAction(componentId, addAction) : null
  $: removeExtension =
    componentId && loaded ? getAction(componentId, removeAction) : null

  // If the filters are updated, notify the target of the change
  $: hydrated && dataComponent && loaded && fire(filterExtension)

  const initTarget = (target: Component | null) => {
    if (!dataComponent && target) {
      dataComponent = target
      // In the event the underlying component is remounted and requires hydration
      if (!hydrated) {
        hydrateFilters()
      }
    } else if (dataComponent && !target) {
      hydrated = false
      dataComponent = null
      filters = {}
      schema = null
    }
  }

  const getValidOperatorsForType = (
    config: FilterConfig | undefined,
    schema: TableSchema | null
  ): {
    value: string
    label: string
  }[] => {
    if (!config?.field || !config.columnType || !schema) {
      return []
    }

    const fieldType = config.columnType || schema[config.field].type
    let coreOperators = QueryUtils.getValidOperatorsForType(
      {
        type: fieldType,
      },
      config.field,
      filterDatasource
    )

    const isDateTime = fieldType === FieldType.DATETIME
    // Label mixins. Override the display text
    const opToDisplay: Record<string, any> = {
      rangeHigh: isDateTime ? "Before" : undefined,
      rangeLow: isDateTime ? "After" : undefined,
      [FilterType.EQUAL]: "Is",
      [FilterType.NOT_EQUAL]: "Is not",
    }

    // Add in the range operator for datetime fields
    coreOperators = [
      ...coreOperators,
      ...(fieldType === FieldType.DATETIME
        ? [{ value: RangeOperator.RANGE, label: "Between" }]
        : []),
    ]

    // Map the operators to set an label overrides
    return coreOperators
      .filter(op => {
        if (isDateTime && op.value === FilterType.ONE_OF) return false
        return true
      })
      .map(op => ({
        ...op,
        label: opToDisplay[op.value] || op.label,
      }))
  }

  const buildExtension = (filters: Record<string, SearchFilter>) => {
    const extension = Helpers.cloneDeep(baseFilter)
    delete extension.onEmptyFilter

    // Pass in current filters
    if (extension.groups) {
      const groups: SearchFilterGroup[] = extension.groups
      groups[0].filters = Object.values(filters)
    }
    return extension
  }

  const fire = (extension: UISearchFilter) => {
    if (!$component?.id || !componentId) return

    if (Object.keys(filters).length == 0) {
      removeExtension?.($component.id)
      toLocalStorage()
      return
    }

    if (persistFilters) {
      toLocalStorage()
    }
    addExtension?.($component.id, isGridblock ? extension : query)
  }

  /**
   * Serialise any selected config to localstorage to retain state on refresh
   */
  const toLocalStorage = () => {
    uiStateStore.update(state => ({
      ...state,
      [$component.id]: { sourceId: filterDatasource.resourceId, filters },
    }))
  }

  /**
   * Purge the cached component settings when the source changes
   */
  const clearLocalStorage = () => {
    uiStateStore.update(state => {
      delete state[$component.id]
      return state
    })
  }

  const excludedTypes = [
    FieldType.ATTACHMENT_SINGLE,
    FieldType.ATTACHMENTS,
    FieldType.AI,
  ]

  async function fetchSchema(datasource: any) {
    if (datasource) {
      const fetchedSchema: TableSchema | null = await fetchDatasourceSchema(
        datasource,
        {
          enrichRelationships: true,
          formSchema: false,
        }
      )

      const filteredSchemaEntries = Object.entries(fetchedSchema || {}).filter(
        ([_, field]: [string, FieldSchema]) => {
          return !excludedTypes.includes(field.type)
        }
      )

      const filteredSchema = Object.fromEntries(filteredSchemaEntries)

      // Necessary to ensure that link fields possess all config required
      // to render their respective UX
      const enrichedSchema = await getRelationshipSchemaAdditions(
        filteredSchema as Record<string, any>
      )

      schema = { ...filteredSchema, ...enrichedSchema }
    } else {
      schema = null
    }
  }

  const getOperators = (
    config: FilterConfig | undefined,
    schema: TableSchema | null
  ) => {
    const operators = getValidOperatorsForType(config, schema)
    return operators
  }

  const clearAll = () => {
    filters = {}
    uiStateStore.update(state => {
      delete state[$component.id]
      return state
    })
  }

  // InitFetch for RelationShipField Display on load.
  // Hardcoded for the user for now
  const createFetch = (initValue: any) => {
    // field and primary - based on datasource
    let searchFilter: SearchFilterGroup = {
      logicalOperator: UILogicalOperator.ALL,
      filters: [
        {
          field: "_id",
          operator: ArrayOperator.ONE_OF,
          value: Array.isArray(initValue) ? initValue : [initValue],
        },
      ],
    }

    // Default filter
    let initFilter = initValue
      ? {
          logicalOperator: UILogicalOperator.ALL,
          groups: [searchFilter],
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
        }
      : undefined

    const ds: { type: string; tableId: string } = {
      type: "user",
      tableId: InternalTable.USER_METADATA,
    }
    return fetchData({
      API,
      datasource: ds as TableDatasource,
      options: {
        filter: initFilter,
        limit: 100,
      },
    })
  }

  // Only dealing with user fields.
  const initRelationShips = (filters: Record<string, SearchFilter>) => {
    const filtered = Object.entries(filters || {}).filter(
      ([_, filter]: [string, SearchFilter]) => {
        return (
          filter.type === FieldType.BB_REFERENCE_SINGLE ||
          filter.type === FieldType.BB_REFERENCE
        )
      }
    )

    return Object.fromEntries(filtered)
  }

  // Flatten and gather all configured users ids
  const getRelIds = (filters: Record<string, SearchFilter>) => {
    const filtered = Object.entries(filters || {}).reduce(
      (acc: string[], [_, filter]) => {
        if (
          (filter.type === FieldType.BB_REFERENCE_SINGLE ||
            filter.type === FieldType.BB_REFERENCE) &&
          filter.value
        ) {
          acc = [
            ...acc,
            ...(Array.isArray(filter.value) ? filter.value : [filter.value]),
          ]
        }
        return acc
      },
      []
    )
    const uniqueIds = new Set(filtered)
    return Array.from(uniqueIds)
  }

  $: rels = initRelationShips($memoFilters)
  $: relIds = getRelIds(rels)

  $: if (!userFetch && relIds.length) {
    userFetch = createFetch(relIds)
  }

  $: fetchedRows = userFetch ? $userFetch?.rows : []

  $: if (fetchedRows.length) {
    const fetched = fetchedRows.reduce((acc: any, ele: any) => {
      acc[ele._id] = ele
      return acc
    }, {})

    // User cache
    rowCache.update(state => ({
      ...state,
      ...fetched,
    }))
  }

  const hydrateFilters = () => {
    // Hydrate with previously set config
    if (persistFilters) {
      const filterState = $uiStateStore[$component.id]?.filters
      filters = Helpers.cloneDeep(filterState || {})
    }
    hydrated = true
  }

  onMount(() => {
    if (!persistFilters) {
      clearLocalStorage()
    } else {
      hydrateFilters()
    }
  })

  onDestroy(() => {
    // Ensure the extension is cleared on destroy
    removeExtension?.($component.id)
  })
</script>

<div>
  <div class="filters">
    <Container wrap direction={"row"} hAlign={"left"} vAlign={"top"} gap={"S"}>
      {#each visibleFilters || [] as config}
        {@const filter = $memoFilters[config.field]}
        <FilterButton
          {size}
          {config}
          {filter}
          {schema}
          {buttonText}
          operators={getOperators(config, schema)}
          on:change={e => {
            if (!e.detail) {
              const { [config.field]: removed, ...rest } = filters
              filters = { ...rest }
            } else {
              filters = { ...filters, [config.field]: e.detail }
            }
          }}
          on:toggle={() => {
            const { [config.field]: removed, ...rest } = filters
            filters = { ...rest }
          }}
        />
      {/each}
      {#if showClear && Object.keys(filters).length}
        <Button {size} secondary on:click={clearAll}>Clear all</Button>
      {/if}
    </Container>
  </div>
</div>

<style>
  .filters {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
