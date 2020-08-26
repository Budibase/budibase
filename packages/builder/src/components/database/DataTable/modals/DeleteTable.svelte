<script>
  import ActionButton from "components/common/ActionButton.svelte"
  import { notifier } from "builderStore/store/notifications"
  import { store, backendUiStore } from "builderStore"
  import * as api from "../api"

  export let table
  export let onClosed

  function deleteTable() {
    backendUiStore.actions.models.delete(table)
  }
</script>

<section>
  <div class="content">
    <header>
      <i class="ri-information-line alert" />
      <h4 class="budibase__title--4">Delete Table</h4>
    </header>
    <p>
      Are you sure you want to delete this table? All of your data will be
      permanently removed. This action cannot be undone.
    </p>
  </div>
  <div class="modal-actions">
    <ActionButton on:click={onClosed}>Cancel</ActionButton>
    <ActionButton
      alert
      on:click={async () => {
        await backendUiStore.actions.models.delete(table)
        notifier.danger('Table deleted')
        onClosed()
      }}>
      Delete
    </ActionButton>
  </div>
</section>

<style>
  .alert {
    color: rgba(255, 0, 31, 1);
    background: var(--grey-1);
    padding: 5px;
  }

  .modal-actions {
    padding: 10px;
    background: var(--grey-1);
    border-top: 1px solid #ccc;
  }

  header {
    display: flex;
    align-items: center;
  }
  .content {
    padding: 30px;
  }

  h4 {
    margin: 0 0 0 10px;
  }
</style>
