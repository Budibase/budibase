<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import * as api from "../api"

  export let modalOpen = false

  let recordInfo = {}

  const onClosed = () => (modalOpen = false)
</script>

<Modal {onClosed} bind:isOpen={modalOpen} title={"Delete Record?"}>
  <h4 class="budibase__title--4">Delete Record</h4>
  Are you sure you want to delete this record? All of your data will be permanently removed. This action cannot be undone.
  <div class="modal-actions">
    <ActionButton on:click={onClosed}>Cancel</ActionButton>
    <ActionButton
      alert
      on:click={() => api.deleteRecord(recordInfo)}>
      Delete
    </ActionButton>
  </div>
</Modal>
