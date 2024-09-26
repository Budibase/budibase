<script>
  import { getContext, onDestroy } from "svelte"
  import { Table } from "@budibase/bbui"
  import SlotRenderer from "./SlotRenderer.svelte"
  import { canBeSortColumn } from "@budibase/frontend-core"
  import Provider from "components/context/Provider.svelte"

  export let dataProvider
  export let columns
  export let rowCount
  export let quiet
  export let size
  export let allowSelectRows
  export let compact
  export let onClick
  export let noRowsMessage

  const component = getContext("component")
  const context = getContext("context")
  const {
    styleable,
    getAction,
    ActionTypes,
    rowSelectionStore,
    generateGoldenSample,
  } = getContext("sdk")

  const customColumnKey = `custom-${Math.random()}`
  const customRenderers = [
    {
      column: customColumnKey,
      component: SlotRenderer,
    },
  ]

  let selectedRows = []

  $: snippets = $context.snippets
  $: hasChildren = $component.children
  $: loading = dataProvider?.loading ?? false
  $: data = dataProvider?.rows || []
  $: fullSchema = dataProvider?.schema ?? {}
  $: primaryDisplay = dataProvider?.primaryDisplay
  $: fields = getFields(fullSchema, columns, false, primaryDisplay)
  $: schema = getFilteredSchema(fullSchema, fields, hasChildren)
  $: setSorting = getAction(
    dataProvider?.id,
    ActionTypes.SetDataProviderSorting
  )
  $: table = dataProvider?.datasource?.type === "table"
  $: {
    rowSelectionStore.actions.updateSelection(
      $component.id,
      selectedRows.length ? selectedRows[0].tableId : "",
      selectedRows.map(row => row._id)
    )
  }

  // If the data changes, double check that the selected elements are still present.
  $: if (data) {
    let rowIds = data.map(row => row._id)
    if (rowIds.length) {
      selectedRows = selectedRows.filter(row => rowIds.includes(row._id))
    }
  }

  // Build our data context
  $: dataContext = {
    selectedRows,
  }

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const goldenRow = generateGoldenSample(data)
    return {
      eventContext: {
        row: goldenRow,
      },
    }
  }

  const getFields = (
    schema,
    customColumns,
    showAutoColumns,
    primaryDisplay
  ) => {
    if (customColumns?.length) {
      return customColumns
    }

    // Otherwise generate columns
    let columns = []
    let autoColumns = []
    Object.entries(schema).forEach(([field, fieldSchema]) => {
      if (fieldSchema.visible === false) {
        return
      }
      if (!fieldSchema?.autocolumn) {
        columns.push(field)
      } else if (showAutoColumns) {
        autoColumns.push(field)
      }
    })

    // Sort columns to respect grid metadata
    const allCols = columns.concat(autoColumns)
    return allCols.sort((a, b) => {
      if (a === primaryDisplay) {
        return -1
      }
      if (b === primaryDisplay) {
        return 1
      }
      const aOrder = schema[a].order
      const bOrder = schema[b].order
      if (aOrder === bOrder) {
        return 0
      }
      if (aOrder == null) {
        return 1
      }
      if (bOrder == null) {
        return -1
      }
      return aOrder < bOrder ? -1 : 1
    })
  }

  const getFilteredSchema = (schema, fields, hasChildren) => {
    let newSchema = {}
    if (hasChildren) {
      newSchema[customColumnKey] = {
        displayName: null,
        order: 0,
        sortable: false,
        divider: true,
        width: "auto",
        preventSelectRow: true,
      }
    }

    fields.forEach(field => {
      const columnName = typeof field === "string" ? field : field.name
      if (!schema[columnName]) {
        return
      }
      newSchema[columnName] = schema[columnName]
      if (!canBeSortColumn(schema[columnName])) {
        newSchema[columnName].sortable = false
      }

      // Add additional settings like width etc
      if (typeof field === "object") {
        newSchema[columnName] = {
          ...newSchema[columnName],
          ...field,
        }
      }
    })
    return newSchema
  }

  const onSort = e => {
    setSorting({
      column: e.detail.column,
      order: e.detail.order,
    })
  }

  const handleClick = e => {
    if (onClick) {
      onClick({ row: e.detail })
    }
  }

  const actions = [
    {
      type: ActionTypes.ClearRowSelection,
      callback: () => (selectedRows = []),
    },
  ]

  onDestroy(() => {
    rowSelectionStore.actions.updateSelection($component.id, [])
  })
</script>

<div use:styleable={$component.styles} class={size}>
  <Provider {actions} data={dataContext}>
    <Table
      {data}
      {schema}
      {loading}
      {rowCount}
      {quiet}
      {compact}
      {customRenderers}
      {snippets}
      allowSelectRows={allowSelectRows && table}
      bind:selectedRows
      allowEditRows={false}
      allowEditColumns={false}
      showAutoColumns={true}
      disableSorting
      autoSortColumns={!columns?.length}
      on:sort={onSort}
      on:click={handleClick}
      placeholderText={noRowsMessage || "No rows found"}
    >
      <slot />
    </Table>
  </Provider>
  {#if allowSelectRows && selectedRows.length}
    <div class="row-count">
      {selectedRows.length} row{selectedRows.length === 1 ? "" : "s"} selected
    </div>
  {/if}
</div>

<style>
  div {
    background-color: var(--spectrum-alias-background-color-secondary);
  }
  .row-count {
    margin-top: var(--spacing-l);
  }
</style>
