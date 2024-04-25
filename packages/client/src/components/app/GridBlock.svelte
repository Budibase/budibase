<script>
  // NOTE: this is not a block - it's just named as such to avoid confusing users,
  // because it functions similarly to one
  import { getContext } from "svelte"
  import { get } from "svelte/store"
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
  export let repeat = null

  const context = getContext("context")
  const component = getContext("component")
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

  $: columnWhitelist = parsedColumns
    ?.filter(col => col.active)
    ?.map(col => col.field)
  $: schemaOverrides = getSchemaOverrides(parsedColumns)
  $: enrichedButtons = enrichButtons(buttons)
  $: parsedColumns = getParsedColumns(columns)
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => grid?.getContext()?.rows.actions.refreshData(),
      metadata: { dataSource: table },
    },
  ]
  $: height = $component.styles?.normal?.height || "408px"
  $: styles = getSanitisedStyles($component.styles)

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const rows = get(grid?.getContext()?.rows)
    const goldenRow = generateGoldenSample(rows)
    const id = get(component).id
    return {
      [id]: goldenRow,
      eventContext: {
        row: goldenRow,
      },
    }
  }

  // Parses columns to fix older formats
  const getParsedColumns = columns => {
    // If the first element has an active key all elements should be in the new format
    if (columns?.length && columns[0]?.active !== undefined) {
      return columns
    }

    return columns?.map(column => ({
      label: column.displayName || column.name,
      field: column.name,
      active: true,
    }))
  }

  const getSchemaOverrides = columns => {
    let overrides = {}
    columns?.forEach(column => {
      overrides[column.field] = {
        displayName: column.label,
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

  const getSanitisedStyles = styles => {
    return {
      ...styles,
      normal: {
        ...styles?.normal,
        height: undefined,
      },
    }
  }
</script>

<div use:styleable={styles} class:in-builder={$builderStore.inBuilder}>
  <span style="--height:{height};">
    <Provider {actions}>
      <Grid
        bind:this={grid}
        datasource={table}
        {API}
        {stripeRows}
        {quiet}
        {initialFilter}
        {initialSortColumn}
        {initialSortOrder}
        {fixedRowHeight}
        {columnWhitelist}
        {schemaOverrides}
        {repeat}
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
        on:rowclick={e => onRowClick?.({ row: e.detail })}
      />
    </Provider>
  </span>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    overflow: hidden;
  }
  div.in-builder :global(*) {
    pointer-events: none;
  }
  span {
    display: contents;
  }
  span :global(.grid) {
    height: var(--height);
  }
</style>
