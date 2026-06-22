<script lang="ts">
  import { REBOOT_CRON } from "@budibase/shared-core"

  export let cronExpression: string | undefined
  export let onchange: ((cronExpression: string) => void) | undefined =
    undefined

  const selectRebootCron = () => {
    onchange?.(REBOOT_CRON)
  }
</script>

<button
  type="button"
  data-cron-expression={cronExpression}
  on:click={selectRebootCron}
>
  Select reboot cron
</button>
