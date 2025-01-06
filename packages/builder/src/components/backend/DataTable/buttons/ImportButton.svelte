<script>
  import { ActionButton, Button, Body, notifications } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import ExistingTableDataImport from "@/components/backend/TableNavigator/ExistingTableDataImport.svelte"
  import { createEventDispatcher } from "svelte"
  import { API } from "@/api"

  export let tableId
  export let tableType
  export let disabled

  const dispatch = createEventDispatcher()

  let popover
  let rows = []
  let allValid = false
  let displayColumn = null
  let identifierFields = []
  let loading = false

  const openPopover = () => {
    rows = []
    allValid = false
    displayColumn = null
    identifierFields = []
    loading = false
    popover.show()
  }

  const importData = async () => {
    try {
      loading = true
      await API.importTableData(tableId, rows, identifierFields)
      notifications.success("Rows successfully imported")
      popover.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Unable to import data")
    } finally {
      loading = false
    }

    // Always refresh rows just to be sure
    dispatch("importrows")
  }
</script>

<DetailPopover title="Import data" bind:this={popover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="DataUpload"
      quiet
      on:click={openPopover}
      {disabled}
      selected={open}
    >
      Import
    </ActionButton>
  </svelte:fragment>
  <Body size="S">
    Import rows to an existing table from a CSV or JSON file. Only columns from
    the file which exist in the table will be imported.
  </Body>
  <ExistingTableDataImport
    {tableId}
    {tableType}
    bind:rows
    bind:allValid
    bind:displayColumn
    bind:identifierFields
  />
  <div>
    <Button cta disabled={loading || !allValid} on:click={importData}>
      Import
    </Button>
  </div>
</DetailPopover>
