<script lang="ts">
  import { BackupTrigger, BackupType } from "@budibase/types"
  import type { BackupTableRow } from "../types"

  interface Props {
    row: BackupTableRow
  }

  let { row }: Props = $props()
  const trigger = $derived(row?.trigger || BackupTrigger.MANUAL)
  const type = $derived(row?.type || BackupType.BACKUP)

  const printTrigger = (value: BackupTrigger) => {
    let final: string = value
    switch (value) {
      case BackupTrigger.PUBLISH:
        final = "published"
        break
      case BackupTrigger.RESTORING:
        final = "pre-restore"
        break
    }
    return final.charAt(0).toUpperCase() + final.slice(1)
  }
</script>

<div class="cell">
  {printTrigger(trigger)}
  {type}
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
