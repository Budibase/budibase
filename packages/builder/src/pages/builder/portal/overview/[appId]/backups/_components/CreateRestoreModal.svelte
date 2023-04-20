<script>
  import { ModalContent, Input, Body } from "@budibase/bbui"
  import { auth } from "stores/portal"

  import { _ } from "../../../../../../../../lang/i18n"

  export let confirm

  let templateName = $auth.user.firstName
    ? `${$auth.user.firstName}'s ${$_(
        "pages.builder.portal.overview.appId.backups._components.CreateRestoreModal.Backup"
      )}`
    : $_(
        "pages.builder.portal.overview.appId.backups._components.CreateRestoreModal.Restore_Backup"
      )
  let name = templateName
</script>

<ModalContent
  onConfirm={() => confirm(name)}
  title={$_(
    "pages.builder.portal.overview.appId.backups._components.CreateRestoreModal.Back_version"
  )}
  confirmText={$_(
    "pages.builder.portal.overview.appId.backups._components.CreateRestoreModal.Confirm_Restore"
  )}
  disabled={!name}
>
  <Body size="S"
    >{$_(
      "pages.builder.portal.overview.appId.backups._components.CreateRestoreModal.Create_backup"
    )}</Body
  >
  <Input
    label={$_(
      "pages.builder.portal.overview.appId.backups._components.CreateRestoreModal.Backup_name"
    )}
    bind:value={name}
  />
</ModalContent>

<style>
</style>
