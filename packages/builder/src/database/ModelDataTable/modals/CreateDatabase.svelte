<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import * as api from "../api"

  export let modalOpen = false

  const onClosed = () => (modalOpen = false)
</script>

<Modal {onClosed} isOpen={modalOpen}>
  CREATE A NEW DATABASE FROM HERE
  <div class="actions">
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={false}>Save</ActionButton>
  </div>
</Modal>
