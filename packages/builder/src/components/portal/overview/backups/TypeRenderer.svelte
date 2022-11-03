<script>
  import { BackupTrigger } from "constants/backend/backups"
  export let row

  $: trigger = row?.trigger || "manual"
  $: type = row?.type || "backup"

  function printTrigger(trig) {
    let final = "undefined"
    switch (trig) {
      case BackupTrigger.PUBLISH:
        final = "published"
        break
      case BackupTrigger.RESTORING:
        final = "pre-restore"
        break
      default:
        final = trig
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
