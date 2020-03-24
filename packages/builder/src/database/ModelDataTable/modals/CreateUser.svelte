<script>
  import Modal from "../../../common/Modal.svelte"
  import { store } from "../../../builderStore"
  import ActionButton from "../../../common/ActionButton.svelte"
  // import * as api from "../api"

  export let onClosed

  let userName

  async function createUser() {
    // const response = await api.createUser($store.appname, userName)
    // store.createUserForInstance(response)
    onClosed()
  }
</script>

<section>
  User Name
  <input class="uk-input" type="text" bind:value={userName} />
  <footer>
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!userName} on:click={createUser}>
      Save
    </ActionButton>
  </footer>
</section>

<style>
  footer {
    position: absolute;
    padding: 20px;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #fafafa;
  }
</style>
