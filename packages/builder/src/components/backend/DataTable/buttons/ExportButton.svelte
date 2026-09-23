<script lang="ts">
  import {
    ActionButton,
    Select,
    notifications,
    Body,
    Button,
  } from "@budibase/bbui"
  import { QueryUtils } from "@budibase/frontend-core"
  import type {
    ExportRowsRequest,
    RowExportFormat,
    SortOrder,
    UISearchFilter,
  } from "@budibase/types"
  import download from "downloadjs"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { ROW_EXPORT_FORMATS } from "@/constants/backend"
  import { dataAPI } from "@/stores/builder"

  interface SortEntry {
    column: string
    order: SortOrder
  }

  interface SelectedRow {
    _id: string
  }

  export let view: string
  export let filters: UISearchFilter | undefined = undefined
  export let sorting: SortEntry[] | undefined = undefined
  export let disabled: boolean = false
  export let selectedRows: SelectedRow[] | undefined = undefined
  export let formats: RowExportFormat[] | undefined = undefined

  const FORMATS: { name: string; key: RowExportFormat }[] = [
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

  let popover: DetailPopover
  let exportFormat: RowExportFormat | undefined
  let loading: boolean = false

  $: options = FORMATS.filter(format => {
    if (formats && !formats.includes(format.key)) {
      return false
    }
    return true
  })
  $: if (!exportFormat) {
    exportFormat = options[0]?.key
  }

  const openPopover = () => {
    loading = false
    popover?.show()
  }

  function downloadWithBlob(data: string, filename: string) {
    download(new Blob([data], { type: "text/plain" }), filename)
  }

  const exportAllData = async ({ format }: { format: RowExportFormat }) => {
    return await $dataAPI.exportView(view, format)
  }

  const exportFilteredData = async ({
    format,
  }: {
    format: RowExportFormat
  }) => {
    const payload: ExportRowsRequest = {}
    if (selectedRows?.length) {
      payload.rows = selectedRows.map(row => row._id)
    }
    if (filters) {
      payload.query = QueryUtils.buildQuery(filters)
    }
    if (sorting?.length) {
      payload.sort = Object.fromEntries(
        sorting.map(sortEntry => [
          sortEntry.column,
          {
            direction: sortEntry.order,
          },
        ])
      )
    }
    return await $dataAPI.exportRows(view, format, payload)
  }

  const exportData = async () => {
    if (!exportFormat) {
      notifications.error("An export format is required")
      return
    }
    const format = exportFormat

    try {
      loading = true
      let data
      if (selectedRows?.length || filters || sorting?.length) {
        data = await exportFilteredData({ format })
      } else {
        data = await exportAllData({ format })
      }
      notifications.success("Export successful")
      downloadWithBlob(data, `export.${format}`)
      popover?.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Error exporting data")
    } finally {
      loading = false
    }
  }
</script>

<DetailPopover title="Export data" bind:this={popover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="download-simple"
      quiet
      on:click={openPopover}
      {disabled}
      selected={open}
    >
      Export
    </ActionButton>
  </svelte:fragment>

  {#if selectedRows?.length}
    <Body size="S">
      <span data-testid="exporting-n-rows">
        <strong>{selectedRows?.length}</strong>
        {`row${selectedRows?.length > 1 ? "s" : ""} will be exported.`}
      </span>
    </Body>
  {:else}
    <Body size="S">
      <span data-testid="export-all-rows">
        Exporting <strong>all</strong> rows.
      </span>
    </Body>
  {/if}
  <span data-testid="format-select">
    <Select
      label="Format"
      bind:value={exportFormat}
      {options}
      getOptionLabel={x => x.name}
      getOptionValue={x => x.key}
    />
  </span>
  <div>
    <Button cta disabled={loading} on:click={exportData}>Export</Button>
  </div>
</DetailPopover>
