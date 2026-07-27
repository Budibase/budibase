<script lang="ts">
  import { InlineAlert } from "@budibase/bbui"

  interface ExecutionRow {
    day: string
    date: string
    time: string
  }

  interface Props {
    executions?: string[]
  }

  let { executions = [] }: Props = $props()

  const parseExecution = (execution: string): ExecutionRow => {
    const [day = "", date = "", time = ""] = execution.split(", ")
    return { day, date, time }
  }

  let rows = $derived(executions.map(execution => parseExecution(execution)))
</script>

<InlineAlert type="info" header="Next executions">
  <div class="next-executions">
    {#each rows as row}
      <div class="execution-row">
        <span class="day">{row.day}</span>
        <span class="date">{row.date}</span>
        <span class="time">{row.time}</span>
      </div>
    {/each}
  </div>
</InlineAlert>

<style>
  .next-executions {
    display: grid;
    gap: 6px;
    margin-top: 15px;
    font-size: 15px;
    line-height: 1.35;
    font-variant-numeric: tabular-nums;
  }

  :global(.spectrum-InLineAlert:has(.next-executions) > i.ph) {
    display: none;
  }

  .execution-row {
    display: grid;
    grid-template-columns: 48px minmax(132px, 1fr) 48px;
    column-gap: 12px;
    align-items: baseline;
  }

  .day,
  .date,
  .time {
    white-space: nowrap;
  }

  .time {
    text-align: right;
  }
</style>
