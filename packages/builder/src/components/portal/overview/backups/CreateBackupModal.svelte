<script>
  import { ModalContent, Input } from "@budibase/bbui"

  export let createManualBackup

  let name
</script>

<ModalContent
  onConfirm={() => createManualBackup(name)}
  title="Create new backup"
  confirmText="Create"
  ><Input label="Backup name" bind:value={name} /></ModalContent
>

<style>
</style>
