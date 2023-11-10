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
  import { ROW_EXPORT_FORMATS } from "constants/backend"

  export let view
  export let filters
  export let sorting
  export let selectedRows = []
  export let formats

  const FORMATS = [
    {
      name: "CSV",
      key: ROW_EXPORT_FORMATS.CSV,
    },
    {
      name: "JSON",
      key: ROW_EXPORT_FORMATS.JSON,
    },
    {
      name: "JSON with Schema",
      key: ROW_EXPORT_FORMATS.JSON_WITH_SCHEMA,
    },
  ]

  $: options = FORMATS.filter(format => {
    if (formats && !formats.includes(format.key)) {
      return false
    }
    return true
  })

  let exportFormat
  let filterLookup

  $: if (options && !exportFormat) {
    exportFormat = Array.isArray(options) ? options[0]?.key : []
  }

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

  function downloadWithBlob(data, filename) {
    download(new Blob([data], { type: "text/plain" }), filename)
  }

  async function exportView() {
    try {
      const data = await API.exportView({
        viewName: view,
        format: exportFormat,
      })
      downloadWithBlob(
        data,
        `export.${exportFormat === "csv" ? "csv" : "json"}`
      )
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
      downloadWithBlob(data, `export.${exportFormat}`)
    } else if (filters || sorting) {
      let response
      try {
        response = await API.exportRows({
          tableId: view,
          format: exportFormat,
          search: {
            query: luceneFilter,
            sort: sorting?.sortColumn,
            sortOrder: sorting?.sortOrder,
            paginate: false,
          },
        })
      } catch (e) {
        console.error("Failed to export", e)
        notifications.error("Export Failed")
      }
      if (response) {
        downloadWithBlob(response, `export.${exportFormat}`)
        notifications.success("Export Successful")
      }
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
    {options}
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
