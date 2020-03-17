<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import ModelView from "../../ModelView.svelte"
  import ActionsHeader from "../../ActionsHeader.svelte"
  import * as api from "./api"

  export let modalOpen = false

  let recordInfo = {}

  const onClosed = () => (modalOpen = false)
</script>

<Modal {onClosed} bind:isOpen={modalOpen} title={'Record'}>
  <h4 class="budibase__title--4">Create / Edit Model</h4>
  <div class="actions">
    <ModelView />
    <ActionsHeader />
    <!-- <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton
      disabled={false}
      on:click={() => api.createNewRecord(recordInfo)}>
      Save
    </ActionButton> -->
  </div>
</Modal>
