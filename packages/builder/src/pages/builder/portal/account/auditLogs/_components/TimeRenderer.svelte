<script>
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  dayjs.extend(relativeTime)

  export let row
</script>

<div>
  {dayjs(row.timestamp).fromNow()}
</div>
