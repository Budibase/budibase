<script>
  import { Button, Modal } from "@budibase/bbui"
  import ViewImportSelection from "@/components/backend/Datasources/TableImportSelection/ViewImportSelection.svelte"

  export let datasource
  let viewImportModal

  $: isPostgres = datasource.source === "POSTGRES"
</script>

{#if isPostgres}
  <Modal bind:this={viewImportModal}>
    <ViewImportSelection
      {datasource}
      onComplete={() => viewImportModal.hide()}
    />
  </Modal>

  <div class="button">
    <Button secondary on:click={() => viewImportModal.show()}>
      Fetch views
    </Button>
  </div>
{/if}

<style>
  .button {
    display: inline-block;
    margin-left: 8px;
  }
</style>
