<script lang="ts">
  import ActivityStatusBadge from "./ActivityStatusBadge.svelte"
  import type { ActivityStatus } from "./activityStatus"

  export let row: {
    status: ActivityStatus
  }
</script>

<ActivityStatusBadge status={row.status} />
