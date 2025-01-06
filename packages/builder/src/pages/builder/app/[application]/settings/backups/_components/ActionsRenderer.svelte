<script>
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Heading,
    Body,
    Modal,
    AbsTooltip,
    TooltipPosition,
  } from "@budibase/bbui"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import CreateRestoreModal from "./CreateRestoreModal.svelte"
  import { createEventDispatcher } from "svelte"
  import { isOnlyUser } from "@/stores/builder"
  import { BackupType } from "@/constants/backend/backups"

  export let row

  let deleteDialog
  let restoreDialog
  let restoreBackupModal

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

  async function downloadExport() {
    window.open(`/api/apps/${row.appId}/backups/${row._id}/file`, "_blank")
  }
</script>

<div class="cell">
  {#if row.type !== BackupType.RESTORE}
    <ActionMenu align="right">
      <div slot="control">
        <Icon size="M" hoverable name="MoreSmallList" />
      </div>
      <AbsTooltip
        position={TooltipPosition.Left}
        text="Unavailable - another user is editing this app"
      >
        <MenuItem
          on:click={restoreDialog.show}
          icon="Revert"
          disabled={!$isOnlyUser}
        >
          Restore
        </MenuItem>
      </AbsTooltip>
      <MenuItem on:click={deleteDialog.show} icon="Delete">Delete</MenuItem>
      <MenuItem on:click={downloadExport} icon="Download">Download</MenuItem>
    </ActionMenu>
  {/if}
</div>

<Modal bind:this={restoreBackupModal}>
  <CreateRestoreModal confirm={onClickRestore} />
</Modal>

<ConfirmDialog
  bind:this={deleteDialog}
  okText="Delete Backup"
  onOk={onClickDelete}
  title="Confirm Deletion"
>
  Are you sure you wish to delete this backup? This action cannot be undone.
</ConfirmDialog>

<ConfirmDialog
  bind:this={restoreDialog}
  okText="Continue"
  onOk={restoreBackupModal?.show}
  title="Confirm restore"
  warning={false}
>
  <Heading size="S">Backup</Heading>
  <Body size="S">{new Date(row.timestamp).toLocaleString()}</Body>
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
