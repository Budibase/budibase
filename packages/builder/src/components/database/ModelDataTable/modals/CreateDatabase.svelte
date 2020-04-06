<script>
  import { store } from "builderStore"
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

<section>
  Database Name
  <input class="uk-input" type="text" bind:value={databaseName} />
  <footer>
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!databaseName} on:click={createDatabase}>
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
