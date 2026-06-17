<script lang="ts">
  import ScheduleBuilder from "@/components/automation/SetupPanel/ScheduleBuilder.svelte"

  export let cronExpression: string
  export let timezone = "UTC"

  let changes: Array<{ cron: string; timezone: string }> = []

  const onChange = (event: CustomEvent<{ cron: string; timezone: string }>) => {
    changes = [...changes, event.detail]
  }
</script>

<ScheduleBuilder {cronExpression} {timezone} on:change={onChange} />
<output data-testid="changes">{JSON.stringify(changes)}</output>
