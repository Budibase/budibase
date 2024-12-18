<script>
  import { Label, Select, Body } from "@budibase/bbui"
  import { onMount } from "svelte"
  import ColumnEditor from "../../ColumnEditor/ColumnEditor.svelte"
  import { findAllMatchingComponents } from "@/helpers/components"
  import { selectedScreen } from "@/stores/builder"

  export let parameters

  const FORMATS = [
    {
      label: "CSV",
      value: "csv",
    },
    {
      label: "JSON",
      value: "json",
    },
  ]

  const DELIMITERS = [
    {
      label: ",",
      value: ",",
    },
    {
      label: ";",
      value: ";",
    },
    {
      label: ":",
      value: ":",
    },
    {
      label: "|",
      value: "|",
    },
    {
      label: "~",
      value: "~",
    },
    {
      label: "[tab]",
      value: "\t",
    },
    {
      label: "[space]",
      value: " ",
    },
  ]

  $: components = findAllMatchingComponents(
    $selectedScreen?.props,
    component => {
      const type = component._component
      return (
        type.endsWith("/table") ||
        type.endsWith("/tableblock") ||
        type.endsWith("/gridblock")
      )
    }
  )
  $: componentOptions = components.map(table => ({
    label: table._instanceName,
    value: table._component.endsWith("/tableblock")
      ? `${table._id}-table`
      : table._id,
  }))
  $: selectedTableId = parameters.tableComponentId?.includes("-")
    ? parameters.tableComponentId.split("-")[0]
    : parameters.tableComponentId
  $: selectedTable = components.find(
    component => component._id === selectedTableId
  )
  $: parameters.rows = `{{ literal [${parameters.tableComponentId}].[selectedRows] }}`

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "csv"
    }
    if (!parameters.delimiter) {
      parameters.delimiter = ","
    }
  })
</script>

<div class="root">
  <Body size="S">
    Choose the table component that you would like to export your row selection
    from.
    <br />
    Please ensure you have enabled row selection in the table settings.
  </Body>

  <div class="params">
    <Label small>Table</Label>
    <Select
      bind:value={parameters.tableComponentId}
      options={componentOptions}
      on:change={() => (parameters.columns = [])}
    />
    <span />
    <Label small>Export as</Label>
    <Select bind:value={parameters.type} options={FORMATS} />
    <Select
      bind:value={parameters.delimiter}
      placeholder={null}
      options={DELIMITERS}
      disabled={parameters.type !== "csv"}
    />
    <Label small>Export columns</Label>
    <ColumnEditor
      value={parameters.columns}
      allowCellEditing={false}
      componentInstance={selectedTable}
      on:change={e => {
        const columns = e.detail
        parameters.columns = columns
        parameters.customHeaders = columns.reduce((headerMap, column) => {
          return {
            [column.name]: column.displayName,
            ...headerMap,
          }
        }, {})
      }}
    />
  </div>
</div>

<style>
  .root {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-xs);
    row-gap: var(--spacing-m);
    grid-template-columns: 90px 1fr 90px;
    align-items: center;
  }
</style>
