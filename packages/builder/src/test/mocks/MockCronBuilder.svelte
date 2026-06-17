<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { REBOOT_CRON } from "@budibase/shared-core"

  export let cronExpression: string | undefined

  const dispatch = createEventDispatcher()

  const selectRebootCron = () => {
    dispatch("change", REBOOT_CRON)
  }
</script>

<button
  type="button"
  data-cron-expression={cronExpression}
  on:click={selectRebootCron}
>
  Select reboot cron
</button>
