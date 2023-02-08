<script>
  import {
    Select,
    ModalContent,
    notifications,
    Body,
    Table,
  } from "@budibase/bbui"
  import download from "downloadjs"
  import { API } from "api"
  import { Constants, LuceneUtils } from "@budibase/frontend-core"

  const FORMATS = [
    {
      name: "CSV",
      key: "csv",
    },
    {
      name: "JSON",
      key: "json",
    },
    {
      name: "JSON with Schema",
      key: "jsonWithSchema",
    },
  ]

  export let view
  export let filters
  export let sorting
  export let selectedRows = []

  let exportFormat = FORMATS[0].key
  let filterLookup

  $: luceneFilter = LuceneUtils.buildLuceneQuery(filters)
  $: exportOpDisplay = buildExportOpDisplay(sorting, filterDisplay, filters)

  const buildFilterLookup = () => {
    return Object.keys(Constants.OperatorOptions).reduce((acc, key) => {
      const op = Constants.OperatorOptions[key]
      acc[op.value] = op.label
      return acc
    }, {})
  }
  filterLookup = buildFilterLookup()

  const filterDisplay = () => {
    if (!filters) {
      return []
    }
    return filters.map(filter => {
      let newFieldName = filter.field + ""
      const parts = newFieldName.split(":")
      parts.shift()
      newFieldName = parts.join(":")
      return {
        Field: newFieldName,
        Operation: filterLookup[filter.operator],
        "Field Value": filter.value || "",
      }
    })
  }

  const buildExportOpDisplay = (sorting, filterDisplay) => {
    let filterDisplayConfig = filterDisplay()
    if (sorting) {
      filterDisplayConfig = [
        ...filterDisplayConfig,
        {
          Field: sorting.sortColumn,
          Operation: "Order By",
          "Field Value": sorting.sortOrder,
        },
      ]
    }
    return filterDisplayConfig
  }

  const displaySchema = {
    Field: {
      type: "string",
      fieldName: "Field",
    },
    Operation: {
      type: "string",
      fieldName: "Operation",
    },
    "Field Value": {
      type: "string",
      fieldName: "Value",
    },
  }

  async function exportView() {
    try {
      const data = await API.exportView({
        viewName: view,
        format: exportFormat,
      })
      download(data, `export.${exportFormat === "csv" ? "csv" : "json"}`)
    } catch (error) {
      notifications.error(`Unable to export ${exportFormat.toUpperCase()} data`)
    }
  }

  async function exportRows() {
    if (selectedRows?.length) {
      const data = await API.exportRows({
        tableId: view,
        rows: selectedRows.map(row => row._id),
        format: exportFormat,
      })
      download(data, `export.${exportFormat}`)
    } else if (filters || sorting) {
      const data = await API.exportRows({
        tableId: view,
        format: exportFormat,
        search: {
          query: luceneFilter,
          sort: sorting?.sortColumn,
          sortOrder: sorting?.sortOrder,
          paginate: false,
        },
      })
      download(data, `export.${exportFormat}`)
    } else {
      await exportView()
    }
  }
</script>

<ModalContent
  title="Export Data"
  confirmText="Export"
  onConfirm={exportRows}
  size={filters?.length || sorting ? "M" : "S"}
>
  {#if selectedRows?.length}
    <Body size="S">
      <strong>{selectedRows?.length}</strong>
      {`row${selectedRows?.length > 1 ? "s" : ""} will be exported`}
    </Body>
  {:else if filters || (sorting?.sortOrder && sorting?.sortColumn)}
    <Body size="S">
      {#if !filters}
        Exporting <strong>all</strong> rows
      {:else}
        Filters applied
      {/if}
    </Body>

    <div class="table-wrap">
      <Table
        schema={displaySchema}
        data={exportOpDisplay}
        {filters}
        loading={false}
        rowCount={filters?.length + 1}
        disableSorting={true}
        allowSelectRows={false}
        allowEditRows={false}
        allowEditColumns={false}
        quiet={true}
        compact={true}
      />
    </div>
  {:else}
    <Body size="S">
      Exporting <strong>all</strong> rows
    </Body>
  {/if}

  <Select
    label="Format"
    bind:value={exportFormat}
    options={FORMATS}
    placeholder={null}
    getOptionLabel={x => x.name}
    getOptionValue={x => x.key}
  />
</ModalContent>

<style>
  .table-wrap :global(.wrapper) {
    max-width: 400px;
  }
</style>
