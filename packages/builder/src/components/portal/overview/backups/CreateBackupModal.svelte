<script>
  import { ModalContent, Input } from "@budibase/bbui"
  import { auth } from "stores/portal"

  export let createManualBackup

  let templateName = $auth.user.firstName
    ? `${$auth.user.firstName}'s Backup`
    : "New Backup"
  let name = templateName
</script>

<ModalContent
  onConfirm={() => createManualBackup(name)}
  title="Create new backup"
  diabled={!name}
  confirmText="Create"
  ><Input label="Backup name" bind:value={name} /></ModalContent
>

<style>
</style>
