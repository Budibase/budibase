<script>
  import { store } from "builderStore"
  import Modal from "components/common/Modal.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "../api"

  export let onClosed

  let databaseName

  async function createDatabase() {
    const response = await api.createDatabase($store.appId, databaseName)
    store.createDatabaseForApp(response)
    onClosed()
  }
</script>

<div>
  <section>
    Database Name
    <input class="uk-input" type="text" bind:value={databaseName} />
  </section>
  <footer>
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!databaseName} on:click={createDatabase}>
      Save
    </ActionButton>
  </footer>
</div>

<style>
  section {
    padding: 30px;
  }
  footer {
    padding: 20px;
    background: var(--grey-1);
    border-radius: 0.5rem;
  }
</style>
