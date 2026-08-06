<script lang="ts">
  import dayjs from "dayjs"
  import advancedFormat from "dayjs/plugin/advancedFormat"

  dayjs.extend(advancedFormat)

  interface Props {
    value?: string | Date | null
  }

  let { value }: Props = $props()

  const formattedDate = $derived(
    value ? dayjs(value).format("Do MMM, YYYY") : "-"
  )
  const titleDate = $derived(
    value ? dayjs(value).format("YYYY-MM-DD HH:mm") : ""
  )
</script>

<span title={titleDate}>{formattedDate}</span>
