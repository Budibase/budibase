<script lang="ts">
  import { Badge } from "@budibase/bbui"
  import { BackupStatus } from "@budibase/types"

  interface Props {
    value?: BackupStatus
  }

  let { value = BackupStatus.STARTED }: Props = $props()
  const status = $derived(value[0].toUpperCase() + value.slice(1))
</script>

<Badge
  grey={value === BackupStatus.STARTED || value === BackupStatus.PENDING}
  green={value === BackupStatus.COMPLETE}
  red={value === BackupStatus.FAILED}
  size="S"
>
  {status}
</Badge>
