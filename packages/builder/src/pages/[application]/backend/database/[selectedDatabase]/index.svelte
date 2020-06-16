<script>
  import { getContext } from "svelte"
  import ModelDataTable from "components/database/ModelDataTable"
  import { store, backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "components/database/ModelDataTable/api"
  import { CreateEditRecordModal } from "components/database/ModelDataTable/modals"

  const { open, close } = getContext("simple-modal")

  const createNewRecord = () => {
    open(
      CreateEditRecordModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  export let selectedDatabase

  let selectedRecord

  $: breadcrumbs = $backendUiStore.breadcrumbs.join(" / ")
</script>

<div class="database-actions">
  <div class="budibase__label--big">{breadcrumbs}</div>
  {#if $backendUiStore.selectedModel._id}
    <ActionButton primary on:click={createNewRecord}>
      Create new record
    </ActionButton>
  {/if}
</div>
{#if $backendUiStore.selectedDatabase._id && $backendUiStore.selectedModel.name}
  <ModelDataTable />
{:else}
  <i style="color: var(--grey-dark)">
    create your first model to start building
  </i>
{/if}

<style>
  .database-actions {
    display: flex;
    justify-content: space-between;
  }
</style>
