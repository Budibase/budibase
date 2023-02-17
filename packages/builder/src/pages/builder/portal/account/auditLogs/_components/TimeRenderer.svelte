<script>
  import dayjs from "dayjs"

  export let row

  import relativeTime from "dayjs/plugin/relativeTime"
  dayjs.extend(relativeTime)
</script>

<div>
  {dayjs(row.date).fromNow()}
</div>
