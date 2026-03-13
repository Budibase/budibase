<script lang="ts">
  import { Toggle } from "@budibase/bbui"

  export let row: {
    _id?: string
    enabled?: boolean
    onToggle?: (_knowledgeBaseId: string, _enabled: boolean) => void
  }

  const handleChange = (event: CustomEvent<boolean>) => {
    if (!row?._id || !row.onToggle) {
      return
    }
    row.onToggle(row._id, event.detail)
  }
</script>

<Toggle noPadding value={!!row?.enabled} on:change={handleChange} />
