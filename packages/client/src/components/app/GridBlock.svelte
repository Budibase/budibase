<script>
  // NOTE: this is not a block - it's just named as such to avoid confusing users,
  // because it functions similarly to one
  import { getContext, onMount } from "svelte"
  import { get, derived, readable } from "svelte/store"
  import { featuresStore } from "stores"
  import { Grid } from "@budibase/frontend-core"

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

  $: currentTheme = $context?.device?.theme
  $: darkMode = !currentTheme?.includes("light")
  $: parsedColumns = getParsedColumns(columns)
  $: schemaOverrides = getSchemaOverrides(parsedColumns)
  $: enrichedButtons = enrichButtons(buttons)
  $: selectedRows = deriveSelectedRows(gridContext)
  $: styles = patchStyles($component.styles, minHeight)
  $: data = { selectedRows: $selectedRows }
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => gridContext?.rows.actions.refreshData(),
      metadata: { dataSource: table },
    },
  ]

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const gridContext = grid?.getContext()
    const rows = get(gridContext?.rows) || []
    const clean = gridContext?.rows.actions.cleanRow || (x => x)
    const cleaned = rows.map(clean)
    const goldenRow = generateGoldenSample(cleaned)
    const id = get(component).id
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

  const getSchemaOverrides = columns => {
    let overrides = {}
    columns.forEach((column, idx) => {
      overrides[column.field] = {
        displayName: column.label,
        order: idx,
        conditions: column.conditions,
        visible: !!column.active,
      }
      if (column.width) {
        overrides[column.field].width = column.width
      }
    })
    return overrides
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
    {initialFilter}
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
    showControls={false}
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
