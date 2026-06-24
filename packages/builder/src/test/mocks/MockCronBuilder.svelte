<script lang="ts">
  import { REBOOT_CRON } from "@budibase/shared-core"

  interface Props {
    cronExpression?: string
    onchange?: (cronExpression: string) => void
  }

  let { cronExpression, onchange }: Props = $props()

  const selectRebootCron = () => {
    onchange?.(REBOOT_CRON)
  }
</script>

<button
  type="button"
  data-cron-expression={cronExpression}
  onclick={selectRebootCron}
>
  Select reboot cron
</button>
