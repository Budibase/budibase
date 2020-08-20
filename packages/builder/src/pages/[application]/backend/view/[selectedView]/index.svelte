<script>
  import { getContext } from "svelte"
  import { Button } from "@budibase/bbui"
  import ViewDataTable from "components/database/DataTable/ViewDataTable"
  import { backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "components/database/DataTable/api"
  import { CreateEditRecordModal } from "components/database/DataTable/modals"

  const { open, close } = getContext("simple-modal")

  $: selectedView = $backendUiStore.selectedView
</script>

{#if $backendUiStore.selectedDatabase._id && selectedView}
  <ViewDataTable view={selectedView} />
{:else}
  <i>create your first table to start building</i>
{/if}

<style>
  i {
    font-size: 20px;
    margin-right: 10px;
    color: var(--grey-4);
  }
</style>
