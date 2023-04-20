<script>
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Heading,
    Body,
    Modal,
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import CreateRestoreModal from "./CreateRestoreModal.svelte"
  import { createEventDispatcher } from "svelte"

  import { _ } from "../../../../../../../../lang/i18n"

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
  <ActionMenu align="right">
    <div slot="control">
      <Icon size="M" hoverable name="MoreSmallList" />
    </div>

    {#if row.type !== "restore"}
      <MenuItem on:click={restoreDialog.show} icon="Revert"
        >{$_(
          "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Restore"
        )}</MenuItem
      >
      <MenuItem on:click={deleteDialog.show} icon="Delete"
        >{$_(
          "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Delete"
        )}</MenuItem
      >
      <MenuItem on:click={downloadExport} icon="Download"
        >{$_(
          "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Download"
        )}</MenuItem
      >
    {/if}
  </ActionMenu>
</div>

<Modal bind:this={restoreBackupModal}>
  <CreateRestoreModal confirm={onClickRestore} />
</Modal>

<ConfirmDialog
  bind:this={deleteDialog}
  okText={$_(
    "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Delete_backup"
  )}
  onOk={onClickDelete}
  title={$_(
    "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Confirm_Deletion"
  )}
>
  {$_(
    "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.delete_backup"
  )}
</ConfirmDialog>

<ConfirmDialog
  bind:this={restoreDialog}
  okText={$_(
    "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Continue"
  )}
  onOk={restoreBackupModal?.show}
  title={$_(
    "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Confirm_restore"
  )}
  warning={false}
>
  <Heading size="S"
    >{$_(
      "pages.builder.portal.overview.appId.backups._components.ActionsRenderer.Backup"
    )}</Heading
  >
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
