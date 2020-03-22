<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import { store, backendUiStore } from "../../../builderStore"
  import * as api from "../api"

  export let record

  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $backendUiStore.selectedDatabase.id
  }

  function onClosed() {
    backendUiStore.actions.modals.hide()
  }
</script>

<section>
  <heading>
    <i class="ri-information-line alert" />
    <h4 class="budibase__title--4">Delete Record</h4>
  </heading>
  <p>
    Are you sure you want to delete this record? All of your data will be
    permanently removed. This action cannot be undone.
  </p>
  <div class="modal-actions">
    <ActionButton on:click={onClosed}>Cancel</ActionButton>
    <ActionButton
      alert
      on:click={async () => {
        await api.deleteRecord(record, currentAppInfo)
        backendUiStore.actions.records.delete(record)
        onClosed()
      }}>
      Delete
    </ActionButton>
  </div>
</section>

<style>
  .alert {
    color: rgba(255, 0, 31, 1);
    background: #fafafa;
    padding: 5px;
  }
  
  .modal-actions {
    position: absolute;
    bottom: 0;
    background: #fafafa;
    border-top: 1px solid #ccc;
    width: 100%;
  }

  heading {
    display: flex;
    align-items: center;
  }

  h4 {
    margin: 0 0 0 10px; 
  }
</style>
