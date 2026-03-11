<script lang="ts">
  import { ActionButton } from "@budibase/bbui"

  export let row: {
    _id?: string
    onManage?: (_knowledgeBaseId: string) => void
  }

  const handleClick = () => {
    if (!row?._id || !row.onManage) {
      return
    }
    row.onManage(row._id)
  }
</script>

<ActionButton size="S" on:click={handleClick}>Manage</ActionButton>
