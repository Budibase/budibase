<script>
  import { Button, Modal } from "@budibase/bbui"
  import ImportQueriesModal from "./RestImportQueriesModal.svelte"

  export let datasourceId
  let importQueriesModal
</script>

<Modal bind:this={importQueriesModal}>
  <ImportQueriesModal createDatasource={false} {datasourceId} />
</Modal>

<div class="button">
  <Button secondary on:click={() => importQueriesModal.show()}>Import</Button>
</div>

<style>
  .button {
    display: inline-block;
    margin-left: 8px;
  }
</style>
