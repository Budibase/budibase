<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import type { AuditLogEnriched } from "@budibase/types"
  import { AUDIT_LOGS_CONTEXT, type AuditLogsContext } from "../auditLogContext"

  interface Props {
    row: AuditLogEnriched
  }

  let { row }: Props = $props()
  const auditLogs = getContext<AuditLogsContext>(AUDIT_LOGS_CONTEXT)
  const onClick = (e: MouseEvent) => {
    e.stopPropagation()
    auditLogs.viewDetails(row)
  }
</script>

<ActionButton size="S" on:click={onClick}>Details</ActionButton>
