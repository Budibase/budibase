<script>
  import { getContext } from "svelte"
  import { Button } from "@budibase/bbui"
  import ViewDataTable from "components/backend/DataTable/ViewDataTable"
  import { backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "components/backend/DataTable/api"
  import CreateEditRecord from "components/backend/DataTable/popovers/CreateEditRecord.svelte"

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
