<script lang="ts">
  import { StatusLight } from "@budibase/bbui"
  import { KnowledgeBaseFileStatus } from "@budibase/types"

  export let row: {
    displayStatus: string
    status: KnowledgeBaseFileStatus
  }

  const getStatusProps = (status: KnowledgeBaseFileStatus) => {
    switch (status) {
      case KnowledgeBaseFileStatus.READY:
        return { positive: true }
      case KnowledgeBaseFileStatus.FAILED:
        return { negative: true }
      default:
        return { notice: true }
    }
  }
</script>

<StatusLight size="S" {...getStatusProps(row.status)}>
  {row.displayStatus}
</StatusLight>
