<script>
  import Modal from "../../../common/Modal.svelte"
  import { store } from "../../../builderStore"
  import ActionButton from "../../../common/ActionButton.svelte"
  import * as api from "../api"

  let databaseName

  async function createDatabase() {
    const response = await api.createDatabase($store.appname, databaseName)
    store.createDatabaseForApp(response)
    onClosed()
  }
</script>

<section>
  CREATE A NEW DATABASE FROM HERE
  <input type="text" bind:value={databaseName} />
  <div class="actions">
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!databaseName} on:click={createDatabase}>Save</ActionButton>
  </div>
</section>
