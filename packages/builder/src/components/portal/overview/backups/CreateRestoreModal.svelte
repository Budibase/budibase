<script>
  import { ModalContent, Input, Body } from "@budibase/bbui"

  export let confirm

  let name
</script>

<ModalContent
  onConfirm={() => confirm(name)}
  title="Backup your current version"
  confirmText="Confirm Restore"
>
  <Body size="S"
    >Create a backup of your current app to allow you to roll back after
    restoring this backup</Body
  >
  <Input label="Backup name" bind:value={name} />
</ModalContent>

<style>
</style>
