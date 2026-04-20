<script lang="ts">
  import { StatusLight } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceSyncRunStatus,
    KnowledgeBaseFileStatus,
  } from "@budibase/types"
  import type {
    FileKnowledgeTableRow,
    KnowledgeTableRow,
    SharePointConnectionTableRow,
  } from "./types"
  import { utils } from "@budibase/shared-core"

  export interface Props {
    row: KnowledgeTableRow
  }

  let { row }: Props = $props()

  const getStatusProps = (row: KnowledgeTableRow) => {
    const { kind } = row
    switch (kind) {
      case "sharepoint_connection":
        return getSharePointStatusProps(row)
      case "file":
        return getFileStatusProps(row)
      default:
        throw utils.unreachable(kind)
    }
  }

  const getFileStatusProps = (row: FileKnowledgeTableRow) => {
    if (row.isUploading) {
      return { info: true }
    }

    switch (row.status) {
      case KnowledgeBaseFileStatus.READY:
        return { positive: true }
      case KnowledgeBaseFileStatus.FAILED:
        return { negative: true }
      default:
        return { notice: true }
    }
  }

  const getSharePointStatusProps = (row: SharePointConnectionTableRow) => {
    if (!row.hasSynced) {
      return { notice: true }
    }
    const total = row.totalCount || 0
    const processing = row.processingCount || 0
    const failed = row.failedCount || 0
    const synced = row.syncedCount || 0

    if (total === 0) {
      return { positive: true }
    }
    if (processing > 0) {
      return { notice: true }
    }
    if (failed > 0) {
      return { negative: true }
    }
    if (synced >= total) {
      return { positive: true }
    }

    switch (row.runStatus) {
      case AgentKnowledgeSourceSyncRunStatus.SUCCESS:
        return { positive: true }
      case AgentKnowledgeSourceSyncRunStatus.FAILED:
        return { negative: true }
      default:
        return { notice: true }
    }
  }
</script>

<StatusLight size="S" {...getStatusProps(row)}>
  {row.displayStatus}
</StatusLight>
