<script>
  import {
    Body,
    FancyCheckboxGroup,
    InlineAlert,
    Layout,
    ModalContent,
  } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { createTableSelectionStore } from "./tableSelectionStore"

  export let integration
  export let datasource
  export let onComplete = () => {}

  $: store = createTableSelectionStore(integration, datasource)

  $: isSheets = integration.name === IntegrationTypes.GOOGLE_SHEETS
  $: tableType = isSheets ? "sheets" : "tables"
  $: title = `Choose your ${tableType}`

  $: confirmText =
    $store.loading || $store.hasSelected
      ? `Fetch ${tableType}`
      : "Continue without fetching"

  $: description = isSheets
    ? "Select which spreadsheets you want to connect."
    : "Choose what tables you want to sync with Budibase"

  $: selectAllText = isSheets ? "Select all sheets" : "Select all"
</script>

<ModalContent
  {title}
  cancelText="Skip"
  size="L"
  {confirmText}
  onConfirm={() => store.importSelectedTables(onComplete)}
  disabled={$store.loading}
>
  {#if $store.loading}
    <div class="loading">
      <Spinner size="20" />
    </div>
  {:else}
    <Layout noPadding no>
      <Body size="S">{description}</Body>

      <FancyCheckboxGroup
        options={$store.tableNames}
        selected={$store.selectedTableNames}
        on:change={e => store.setSelectedTableNames(e.detail)}
        {selectAllText}
      />
      {#if $store.error}
        <InlineAlert
          type="error"
          header="Error fetching {tableType}"
          message={$store.error.description}
        />
      {/if}
    </Layout>
  {/if}
</ModalContent>

<style>
  .loading {
    display: flex;
    justify-content: center;
  }
</style>
