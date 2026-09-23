<script lang="ts">
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import type { AuditLogEnriched } from "@budibase/types"

  dayjs.extend(relativeTime)

  interface Props {
    row: AuditLogEnriched
  }

  let { row }: Props = $props()
</script>

<div>
  {dayjs(row.timestamp).fromNow()}
</div>
