<script lang="ts">
  import type {
    AgentRequestStatus,
    PlatformActionContainerStatus,
  } from "@budibase/types"
  import ActivityStatusBadge from "./ActivityStatusBadge.svelte"

  export let row: {
    status: AgentRequestStatus | PlatformActionContainerStatus
  }
</script>

<ActivityStatusBadge status={row.status} />
