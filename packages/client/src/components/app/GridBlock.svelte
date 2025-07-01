<script>
  // NOTE: this is not a block - it's just named as such to avoid confusing users,
  // because it functions similarly to one
  import { getContext, onMount } from "svelte"
  import { get, derived, readable } from "svelte/store"
  import { featuresStore } from "@/stores"
  import { Grid } from "@budibase/frontend-core"
  import { processStringSync } from "@budibase/string-templates"
  import { UILogicalOperator, EmptyFilterOption } from "@budibase/types"

  // table is actually any datasource, but called table for legacy compatibility
  export let table
  export let allowAddRows = true
  export let allowEditRows = true
  export let allowDeleteRows = true
  export let stripeRows = false
  export let quiet = false
  export let initialFilter = null
  export let initialSortColumn = null
  export let initialSortOrder = null
  export let fixedRowHeight = null
  export let columns = null
  export let onRowClick = null
  export let buttons = null
  export let buttonsCollapsed = false
  export let buttonsCollapsedText = null

  const context = getContext("context")
  const component = getContext("component")
  const { environmentStore } = getContext("sdk")
  const {
    styleable,
    API,
    builderStore,
    notificationStore,
    enrichButtonActions,
    ActionTypes,
    createContextStore,
    Provider,
    generateGoldenSample,
  } = getContext("sdk")

  let grid
  let gridContext
  let minHeight = 0

  let filterExtensions = {}

  $: id = $component.id
  $: currentTheme = $context?.device?.theme
  $: darkMode = !currentTheme?.includes("light")
  $: parsedColumns = getParsedColumns(columns)
  $: enrichedButtons = enrichButtons(buttons)
  $: schemaOverrides = getSchemaOverrides(parsedColumns, $context)
  $: selectedRows = deriveSelectedRows(gridContext)
  $: styles = patchStyles($component.styles, minHeight)
  $: rowMap = gridContext?.rowLookupMap

  $: data = {
    selectedRows: $selectedRows,
    embeddedData: {
      dataSource: table,
      componentId: $component.id,
      loaded: !!$rowMap,
    },
  }

  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => gridContext?.rows.actions.refreshData(),
      metadata: { dataSource: table },
    },
    {
      type: ActionTypes.AddDataProviderFilterExtension,
      callback: addFilterExtension,
    },
    {
      type: ActionTypes.RemoveDataProviderFilterExtension,
      callback: removeFilterExtension,
    },
  ]

  $: extendedFilter = extendFilter(initialFilter, filterExtensions)

  /**
   *
   * @param componentId Originating Component id
   * @param extension Filter extension
   */
  const addFilterExtension = (componentId, extension) => {
    if (!componentId || !extension) {
      return
    }
    filterExtensions = { ...filterExtensions, [componentId]: extension }
  }

  /**
   *
   * @param componentId Originating Component id
   * @param extension Filter extension
   */
  const removeFilterExtension = componentId => {
    if (!componentId) {
      return
    }
    const { [componentId]: removed, ...rest } = filterExtensions
    filterExtensions = { ...rest }
  }

  const extendFilter = (initialFilter, extensions) => {
    if (!Object.keys(extensions || {}).length) {
      return initialFilter
    }
    return {
      groups: (initialFilter ? [initialFilter] : []).concat(
        Object.values(extensions)
      ),
      logicalOperator: UILogicalOperator.ALL,
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
    }
  }

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const gridContext = grid?.getContext()
    const rows = get(gridContext?.rows) || []
    const clean = gridContext?.rows.actions.cleanRow || (x => x)
    const cleaned = rows.map(clean)
    const goldenRow = generateGoldenSample(cleaned)
    return {
      // Not sure what this one is for...
      [id]: goldenRow,

      // For row conditions context
      row: goldenRow,

      // For button action context
      eventContext: {
        row: goldenRow,
      },
    }
  }

  // Parses columns to fix older formats
  const getParsedColumns = columns => {
    if (!columns?.length) {
      return []
    }
    // If the first element has an active key all elements should be in the new format
    if (columns[0].active !== undefined) {
      return columns
    }
    return columns.map(column => ({
      label: column.displayName || column.name,
      field: column.name,
      active: true,
    }))
  }

  const getSchemaOverrides = (columns, context) => {
    let overrides = {}
    columns.forEach((column, idx) => {
      overrides[column.field] = {
        displayName: column.label,
        order: idx,
        visible: !!column.active,
        conditions: enrichConditions(column.conditions, context),
        format: createFormatter(column),

        // Small hack to ensure we react to all changes, as our
        // memoization cannot compare differences in functions
        rand: column.conditions?.length ? Math.random() : null,
      }
      if (column.width) {
        overrides[column.field].width = column.width
      }
    })
    return overrides
  }

  const enrichConditions = (conditions, context) => {
    return conditions?.map(condition => {
      return {
        ...condition,
        referenceValue: processStringSync(
          condition.referenceValue || "",
          context
        ),
      }
    })
  }

  const createFormatter = column => {
    if (typeof column.format !== "string" || !column.format.trim().length) {
      return null
    }
    return row => processStringSync(column.format, { [id]: row })
  }

  const enrichButtons = buttons => {
    if (!buttons?.length) {
      return null
    }
    return buttons.map(settings => ({
      size: "M",
      text: settings.text,
      type: settings.type,
      icon: settings.icon,
      onClick: async row => {
        // Create a fake, ephemeral context to run the buttons actions with
        const id = get(component).id
        const gridContext = createContextStore(context)
        gridContext.actions.provideData(id, row)
        const fn = enrichButtonActions(settings.onClick, get(gridContext))
        return await fn?.({ row })
      },
    }))
  }

  const deriveSelectedRows = gridContext => {
    if (!gridContext) {
      return readable([])
    }
    return derived(
      [gridContext.selectedRows, gridContext.rowLookupMap],
      ([$selectedRows, $rowLookupMap]) => {
        return Object.entries($selectedRows || {})
          .filter(([_, selected]) => selected)
          .map(([rowId]) => {
            return gridContext.rows.actions.cleanRow($rowLookupMap[rowId])
          })
      }
    )
  }

  const patchStyles = (styles, minHeight) => {
    return {
      ...styles,
      normal: {
        ...styles?.normal,
        "min-height": `${minHeight}px`,
      },
    }
  }

  onMount(() => {
    gridContext = grid.getContext()
    gridContext.minHeight.subscribe($height => (minHeight = $height))
  })
</script>

<div use:styleable={styles} class:in-builder={$builderStore.inBuilder}>
  <Grid
    bind:this={grid}
    datasource={table}
    {API}
    {stripeRows}
    {quiet}
    {darkMode}
    initialFilter={extendedFilter}
    {initialSortColumn}
    {initialSortOrder}
    {fixedRowHeight}
    {schemaOverrides}
    canAddRows={allowAddRows}
    canEditRows={allowEditRows}
    canDeleteRows={allowDeleteRows}
    canEditColumns={false}
    canExpandRows={false}
    canSaveSchema={false}
    notifySuccess={notificationStore.actions.success}
    notifyError={notificationStore.actions.error}
    buttons={enrichedButtons}
    {buttonsCollapsed}
    {buttonsCollapsedText}
    isCloud={$environmentStore.cloud}
    aiEnabled={$featuresStore.aiEnabled}
    on:rowclick={e => onRowClick?.({ row: e.detail })}
  />
</div>

<Provider {data} {actions} />

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 4px;
    overflow: hidden;
    height: 410px;
  }
  div.in-builder :global(> *) {
    pointer-events: none !important;
  }
</style>
