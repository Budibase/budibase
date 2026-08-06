<script lang="ts">
  import type { AgentRequestStatus } from "@budibase/types"
  import ActivityStatusBadge from "./ActivityStatusBadge.svelte"

  export let row: {
    status: AgentRequestStatus
  }
</script>

<ActivityStatusBadge status={row.status} />
