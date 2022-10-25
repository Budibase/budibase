<script>
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Input,
    Heading,
    Body,
    Modal,
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import CreateRestoreModal from "./CreateRestoreModal.svelte"
  import { createEventDispatcher } from "svelte"

  export let row

  let deleteDialog
  let restoreDialog
  let updateDialog
  let name
  let restoreBackupModal

  const dispatch = createEventDispatcher()

  const onClickRestore = name => {
    dispatch("buttonclick", {
      type: "backupRestore",
      name,
      backupId: row._id,
      restoreBackupName: name,
    })
  }

  const onClickDelete = () => {
    dispatch("buttonclick", {
      type: "backupDelete",
      backupId: row._id,
    })
  }

  const onClickUpdate = () => {
    dispatch("buttonclick", {
      type: "backupUpdate",
      backupId: row._id,
      name,
    })
  }

  async function downloadExport() {
    window.open(`/api/apps/${row.appId}/backups/${row._id}/file`, "_blank")
  }
</script>

<div class="cell">
  <ActionMenu align="right">
    <div slot="control">
      <Icon size="M" hoverable name="MoreSmallList" />
    </div>

    {#if row.type !== "restore"}
      <MenuItem on:click={restoreDialog.show} icon="Revert">Restore</MenuItem>
      <MenuItem on:click={deleteDialog.show} icon="Delete">Delete</MenuItem>
      <MenuItem on:click={downloadExport} icon="Download">Download</MenuItem>
    {/if}
    <MenuItem on:click={updateDialog.show} icon="Edit">Update</MenuItem>
  </ActionMenu>
</div>

<Modal bind:this={restoreBackupModal}>
  <CreateRestoreModal confirm={name => onClickRestore(name)} />
</Modal>

<ConfirmDialog
  bind:this={deleteDialog}
  okText="Delete Backup"
  onOk={onClickDelete}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the backup
  <i>{row.name}?</i>
  This action cannot be undone.
</ConfirmDialog>

<ConfirmDialog
  bind:this={restoreDialog}
  okText="Continue"
  onOk={restoreBackupModal?.show}
  title="Confirm restore"
  warning={false}
>
  <Heading size="S">{row.name || "Backup"}</Heading>
  <Body size="S">{new Date(row.timestamp).toLocaleString()}</Body>
</ConfirmDialog>

<ConfirmDialog
  bind:this={updateDialog}
  disabled={!name}
  okText="Confirm"
  onOk={onClickUpdate}
  title="Update Backup"
  warning={false}
>
  <Input onlabel="Backup name" placeholder={row.name} bind:value={name} />
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
