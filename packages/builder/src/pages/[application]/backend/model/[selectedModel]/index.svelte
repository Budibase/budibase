<script>
  import { getContext } from "svelte"
  import { Button } from "@budibase/bbui"
  import ModelDataTable from "components/backend/DataTable"
  import { backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "components/backend/DataTable/api"
  import CreateEditRecordModal from "components/backend/DataTable/popovers/CreateEditRecord.svelte"

  const { open, close } = getContext("simple-modal")

  $: selectedModel = $backendUiStore.selectedModel
</script>

{#if $backendUiStore.selectedDatabase._id && selectedModel.name}
  <ModelDataTable />
{:else}
  <i>Create your first table to start building</i>
{/if}

<style>
  i {
    font-size: 20px;
    padding-bottom: 10px;
    color: var(--grey-4);
  }
</style>
