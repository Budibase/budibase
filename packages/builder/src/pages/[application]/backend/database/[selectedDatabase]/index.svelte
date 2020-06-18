<script>
  import { getContext } from "svelte"
  import { Button } from "@budibase/bbui";
  import EmptyModel from "components/nav/ModelNavigator/EmptyModel.svelte"
  import ModelDataTable from "components/database/ModelDataTable"
  import { store, backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "components/database/ModelDataTable/api"
  import { CreateEditRecordModal } from "components/database/ModelDataTable/modals"

  const { open, close } = getContext("simple-modal")

  $: selectedModel = $backendUiStore.selectedModel 

  const createNewRecord = () => {
    open(
      CreateEditRecordModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }
</script>

{#if selectedModel.schema && Object.keys(selectedModel.schema).length === 0}
  <EmptyModel />
{:else if $backendUiStore.selectedDatabase._id && selectedModel.name}
  <ModelDataTable />
{:else}
  <i style="color: var(--grey-dark)">
    create your first model to start building
  </i>
{/if}

<style>
  i {
    font-size: 20px;
    margin-right: 10px;
  }
</style>
