<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import { store, backendUiStore } from "../../../builderStore"
  import * as api from "../api"

  export let modalOpen = false
  export let record

  $: currentAppInfo = {
    instanceId: $store.currentInstanceId,
    appname: $store.appname,
  }

  function onClosed() {
    backendUiStore.actions.modals.hide()
  }

</script>

<Modal {onClosed} isOpen={modalOpen}>
  <h4 class="budibase__title--4">Delete Record</h4>
  Are you sure you want to delete this record? All of your data will be permanently removed. This action cannot be undone.
  <div class="modal-actions">
    <ActionButton on:click={onClosed}>Cancel</ActionButton>
    <ActionButton
      alert
      on:click={async () => { 
        await api.deleteRecord(record, currentAppInfo)
        backendUiStore.actions.records.delete(record)
        onClosed();
      }}>
      Delete
    </ActionButton>
  </div>
</Modal>
