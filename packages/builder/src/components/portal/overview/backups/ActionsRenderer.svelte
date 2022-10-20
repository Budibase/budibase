<script>
  import { ActionButton, ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { createEventDispatcher } from "svelte"

  export let row

  let deleteDialog
  let restoreDialog
  let editDialog
  const dispatch = createEventDispatcher()

  const onClickRestore = () => {
    dispatch("buttonclick", {
      type: "backupRestore",
      backupId: row._id,
    })
  }

  const onClickDelete = () => {
    dispatch("buttonclick", {
      type: "backupDelete",
      backupId: row._id,
    })
  }
</script>

<div class="cell">
  <ActionButton on:click={restoreDialog.show}>Restore</ActionButton>
  <ActionMenu>
    <div slot="control">
      <Icon size="M" hoverable name="MoreSmallList" />
    </div>

    <MenuItem on:click={deleteDialog.show} icon="Delete">Delete</MenuItem>
    <MenuItem on:click={editDialog.show} icon="Edit">Edit</MenuItem>
  </ActionMenu>
</div>

<ConfirmDialog
  bind:this={deleteDialog}
  okText="Delete Backup"
  onOk={onClickDelete}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the backup
  <i>{row.name}</i>
  This action cannot be undone.
</ConfirmDialog>

<ConfirmDialog
  bind:this={restoreDialog}
  okText="Restore Backup"
  onOk={onClickRestore}
  title="Confirm Restore"
  warning={false}
>
  Are you sure you wish to restore this backup
  <i>{row.name}</i>. This action cannot be undone.
</ConfirmDialog>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
    margin-left: auto;
  }
</style>
