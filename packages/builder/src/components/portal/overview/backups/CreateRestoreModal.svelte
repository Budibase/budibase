<script>
  import { ModalContent, Input, Body } from "@budibase/bbui"
  import { auth } from "stores/portal"

  export let confirm

  let templateName = $auth.user.firstName
    ? `${$auth.user.firstName}'s Backup`
    : "Restore Backup"
  let name = templateName
</script>

<ModalContent
  onConfirm={() => confirm(name)}
  title="Back up your current version"
  confirmText="Confirm Restore"
  disabled={!name}
>
  <Body size="S"
    >Create a backup of your current app to allow you to roll back after
    restoring this backup</Body
  >
  <Input label="Backup name" bind:value={name} />
</ModalContent>

<style>
</style>
