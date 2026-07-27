<script lang="ts">
  import ScheduleBuilder from "@/components/automation/SetupPanel/ScheduleBuilder.svelte"

  interface Props {
    cronExpression: string
    timezone?: string
  }

  let { cronExpression, timezone = "UTC" }: Props = $props()

  let changes: Array<{ cron: string; timezone: string }> = $state([])

  const onChange = (update: { cron: string; timezone: string }) => {
    changes = [...changes, update]
  }
</script>

<ScheduleBuilder {cronExpression} {timezone} onchange={onChange} />
<output data-testid="changes">{JSON.stringify(changes)}</output>
