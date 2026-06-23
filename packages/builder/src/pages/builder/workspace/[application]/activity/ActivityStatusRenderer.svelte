<script lang="ts">
  import { Badge, Icon } from "@budibase/bbui"
  import type { AgentRequestStatus } from "@budibase/types"

  export let row: {
    statusLabel: string
    status: AgentRequestStatus
  }

  const iconByStatus = {
    completed: "check-circle",
  } as const

  const badgeColorsByStatus = {
    completed: {
      backgroundColor: "#4d6300",
      textColor: "#f5ffbe",
    },
  } as const
</script>

<Badge
  size="S"
  backgroundColor={badgeColorsByStatus[row.status].backgroundColor}
  textColor={badgeColorsByStatus[row.status].textColor}
>
  {row.statusLabel}
  <span class="status-icon">
    <Icon size="XS" name={iconByStatus[row.status]} color="currentColor" />
  </span>
</Badge>

<style>
  :global(.spectrum-Label) {
    display: inline-flex;
    align-items: center;
  }

  .status-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 6px;
  }
</style>
