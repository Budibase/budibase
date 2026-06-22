<script lang="ts">
  import ScheduleBuilder from "@/components/automation/SetupPanel/ScheduleBuilder.svelte"

  export let cronExpression: string
  export let timezone = "UTC"

  let changes: Array<{ cron: string; timezone: string }> = []

  const onChange = (update: { cron: string; timezone: string }) => {
    changes = [...changes, update]
  }
</script>

<ScheduleBuilder {cronExpression} {timezone} onchange={onChange} />
<output data-testid="changes">{JSON.stringify(changes)}</output>
