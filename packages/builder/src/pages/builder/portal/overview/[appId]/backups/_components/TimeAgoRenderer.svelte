<script>
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"

  dayjs.extend(relativeTime)

  export let value
</script>

<span title={value}>{dayjs(value).fromNow()}</span>
