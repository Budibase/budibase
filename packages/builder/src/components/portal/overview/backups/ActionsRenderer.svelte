<script>
  import {
    ActionButton,
    ActionMenu,
    MenuItem,
    Icon,
    Input,
    Heading,
    Body,
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { createEventDispatcher } from "svelte"
  import download from "downloadjs"
  import { backups } from "stores/portal"

  export let row

  let deleteDialog
  let restoreDialog
  let updateDialog
  let name
  let restoreBackupName

  const dispatch = createEventDispatcher()

  const onClickRestore = () => {
    dispatch("buttonclick", {
      type: "backupRestore",
      backupId: row._id,
      restoreBackupName,
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
    let resp = await backups.downloadBackup({
      backupId: row._id,
      appId: row.appId,
    })
    download(resp, row.filename)
  }
</script>

<div class="cell">
  <ActionButton on:click={restoreDialog.show}>Restore</ActionButton>
  <ActionMenu>
    <div slot="control">
      <Icon size="M" hoverable name="MoreSmallList" />
    </div>

    <MenuItem on:click={deleteDialog.show} icon="Delete">Delete</MenuItem>
    <MenuItem on:click={updateDialog.show} icon="Edit">Update</MenuItem>
    <MenuItem on:click={downloadExport} icon="Download">Download</MenuItem>
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
  <Heading size="S">{row.name}</Heading>
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
  <ConfirmDialog />
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
