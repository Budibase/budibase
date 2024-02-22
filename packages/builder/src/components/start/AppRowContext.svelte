<script>
  import { ActionMenu, MenuItem, Icon, Modal } from "@budibase/bbui"
  import DeleteModal from "components/deploy/DeleteModal.svelte"
  import ExportAppModal from "./ExportAppModal.svelte"
  import DuplicateAppModal from "./DuplicateAppModal.svelte"

  export let app

  let deleteModal
  let exportModal
  let duplicateModal

  let exportPublishedVersion = false
</script>

<DeleteModal
  bind:this={deleteModal}
  appId={app.devId}
  appName={app.name}
  onDeleteSuccess={() => {}}
/>

<Modal bind:this={exportModal} padding={false}>
  <ExportAppModal {app} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={duplicateModal} padding={false}>
  <DuplicateAppModal appId={app.devId} appName={app.name} />
</Modal>

<ActionMenu align="right">
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem
    icon="Copy"
    on:click={() => {
      duplicateModal.show()
    }}
  >
    Duplicate
  </MenuItem>
  <MenuItem
    icon="Export"
    on:click={() => {
      exportPublishedVersion = false
      exportModal.show()
    }}
  >
    Export latest edited app
  </MenuItem>
  {#if app.deployed}
    <MenuItem
      icon="Export"
      on:click={() => {
        exportPublishedVersion = true
        exportModal.show()
      }}
    >
      Export latest published app
    </MenuItem>
  {/if}
  <MenuItem
    icon="Delete"
    on:click={() => {
      deleteModal.show()
    }}
  >
    Delete
  </MenuItem>
</ActionMenu>
