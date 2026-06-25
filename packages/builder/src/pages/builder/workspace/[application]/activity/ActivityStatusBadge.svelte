<script lang="ts">
  import { Badge, Icon } from "@budibase/bbui"
  import type { AgentRequestStatus } from "@budibase/types"

  let {
    status,
  }: {
    status: AgentRequestStatus
  } = $props()

  const iconByStatus = {
    completed: "check-circle",
  } as const

  const badgeColorsByStatus = {
    completed: {
      backgroundColor: "var(--spectrum-semantic-positive-color-status)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
  } as const

  const statusLabelByStatus = {
    completed: "Completed",
  } as const
</script>

<div class="activity-status-badge">
  <Badge
    size="S"
    backgroundColor={badgeColorsByStatus[status].backgroundColor}
    textColor={badgeColorsByStatus[status].textColor}
  >
    {statusLabelByStatus[status]}
    <span class="status-icon">
      <Icon size="XS" name={iconByStatus[status]} color="currentColor" />
    </span>
  </Badge>
</div>

<style>
  .activity-status-badge :global(.spectrum-Label) {
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
