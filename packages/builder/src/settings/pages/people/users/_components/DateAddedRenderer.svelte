<svelte:options runes={true} />

<script>
  import dayjs from "dayjs"
  import advancedFormat from "dayjs/plugin/advancedFormat"

  dayjs.extend(advancedFormat)

  let { value } = $props()

  const formattedDate = $derived(
    value ? dayjs(value).format("Do MMM, YYYY") : "-"
  )
  const titleDate = $derived(
    value ? dayjs(value).format("YYYY-MM-DD HH:mm") : ""
  )
</script>

<span title={titleDate}>{formattedDate}</span>
