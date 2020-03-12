<script>
  import Modal from "../../common/Modal.svelte"
  import ActionButton from "../../common/ActionButton.svelte"
  import * as api from "./api"

  export let modalOpen = false

  let recordInfo = {}

  const onClosed = () => (modalOpen = false)
</script>

<Modal {onClosed} bind:isOpen={modalOpen} title={"Create / Edit Field"}>

  <div class="actions">
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton
      disabled={false}
      on:click={() => api.createNewRecord(recordInfo)}>
      Save
    </ActionButton>
  </div>
</Modal>
