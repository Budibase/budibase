<script>
  import Modal from "../../../common/Modal.svelte"
  import { store } from "../../../builderStore"
  import ActionButton from "../../../common/ActionButton.svelte"
  import * as api from "../api"

  export let modalOpen = false

  let userName

  const onClosed = () => (modalOpen = false)

  async function createUser() {
    const response = await api.createUser($store.appname, userName)
    store.createUserForInstance(response)
    onClosed()
  }
</script>

<Modal {onClosed} isOpen={modalOpen}>
  CREATE A NEW user FROM HERE
  <input type="text" bind:value={userName} />
  <div class="actions">
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!userName} on:click={createUser}>Save</ActionButton>
  </div>
</Modal>
