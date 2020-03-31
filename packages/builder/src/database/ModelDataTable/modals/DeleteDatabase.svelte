<script>
  import Modal from "../../../common/Modal.svelte"
  import { store } from "../../../builderStore"
  import ActionButton from "../../../common/ActionButton.svelte"
  import * as api from "../api"

  export let onClosed

  let databaseName

  // async function deleteDatabase() {
  //   const response = await api.deleteDatabase($)
  //   store.createDatabaseForApp(response)
  //   onClosed()
  // }
</script>

<section>
  Are you sure you want to delete {database}?
  <footer>
    <ActionButton disabled={!databaseName} on:click={deleteDatabase}>
      Delete
    </ActionButton>
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
