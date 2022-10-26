<script>
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  dayjs.extend(relativeTime)

  export let value
  $: timeSince = dayjs(value).fromNow()
</script>

<div class="cell">
  {timeSince} - <DateTimeRenderer {value} />
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
