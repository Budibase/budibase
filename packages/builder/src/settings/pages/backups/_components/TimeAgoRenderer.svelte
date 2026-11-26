<script lang="ts">
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"

  dayjs.extend(relativeTime)

  interface Props {
    value: string
  }

  let { value }: Props = $props()
</script>

<span title={value}>{dayjs(value).fromNow()}</span>
