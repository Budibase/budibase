<script>
  import {
    ActionButton,
    Select,
    notifications,
    Body,
    Button,
  } from "@budibase/bbui"
  import download from "downloadjs"
  import { API } from "@/api"
  import { ROW_EXPORT_FORMATS } from "@/constants/backend"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  export let view
  export let sorting
  export let disabled = false
  export let selectedRows
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

  let popover
  let exportFormat
  let loading = false

  $: options = FORMATS.filter(format => {
    if (formats && !formats.includes(format.key)) {
      return false
    }
    return true
  })
  $: if (options && !exportFormat) {
    exportFormat = Array.isArray(options) ? options[0]?.key : []
  }

  const openPopover = () => {
    loading = false
    popover.show()
  }

  function downloadWithBlob(data, filename) {
    download(new Blob([data], { type: "text/plain" }), filename)
  }

  const exportAllData = async () => {
    return await API.exportView(view, exportFormat)
  }

  const exportFilteredData = async () => {
    let payload = {}
    if (selectedRows?.length) {
      payload.rows = selectedRows.map(row => row._id)
    }
    if (sorting) {
      payload.sort = sorting.sortColumn
      payload.sortOrder = sorting.sortOrder
    }
    return await API.exportRows(view, exportFormat, payload)
  }

  const exportData = async () => {
    try {
      loading = true
      let data
      if (selectedRows?.length || sorting) {
        data = await exportFilteredData()
      } else {
        data = await exportAllData()
      }
      notifications.success("Export successful")
      downloadWithBlob(data, `export.${exportFormat}`)
      popover.hide()
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
      icon="DataDownload"
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
      placeholder={null}
      getOptionLabel={x => x.name}
      getOptionValue={x => x.key}
    />
  </span>
  <div>
    <Button cta disabled={loading} on:click={exportData}>Export</Button>
  </div>
</DetailPopover>
