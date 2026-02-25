<script>
  import dayjs from "dayjs"
  import advancedFormat from "dayjs/plugin/advancedFormat"

  dayjs.extend(advancedFormat)

  export let value

  $: formattedDate = value ? dayjs(value).format("Do MMM, YYYY") : "-"
  $: titleDate = value ? dayjs(value).format("YYYY-MM-DD HH:mm") : ""
</script>

<span title={titleDate}>{formattedDate}</span>
