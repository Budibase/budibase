<script lang="ts">
  import { Badge, Icon } from "@budibase/bbui"
  import type { AgentRequestStatus } from "@budibase/types"

  let {
    status,
  }: {
    status: AgentRequestStatus
  } = $props()

  const iconByStatus: Record<AgentRequestStatus, string> = {
    active: "spinner",
    completed: "check-circle",
    failed: "x-circle",
  }

  const badgeColorsByStatus: Record<
    AgentRequestStatus,
    { backgroundColor: string; textColor: string }
  > = {
    active: {
      backgroundColor: "var(--spectrum-semantic-informative-color-status)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
    completed: {
      backgroundColor: "var(--spectrum-semantic-positive-color-status)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
    failed: {
      backgroundColor: "var(--spectrum-semantic-negative-color-status)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
  }

  const statusLabelByStatus: Record<AgentRequestStatus, string> = {
    active: "Active",
    completed: "Completed",
    failed: "Failed",
  }
</script>

<div class="activity-status-badge">
  <Badge
    size="S"
    backgroundColor={badgeColorsByStatus[status].backgroundColor}
    textColor={badgeColorsByStatus[status].textColor}
  >
    {statusLabelByStatus[status]}
    <span class="status-icon" class:spinning={status === "active"}>
      <Icon size="XS" name={iconByStatus[status]} color="currentColor" />
    </span>
  </Badge>
</div>

<style>
  .activity-status-badge :global(.spectrum-Label) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 4px;
    border-radius: 3px;
    font-size: 13px;
    line-height: 17px;
    font-weight: 400;
  }

  .status-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
  }

  .status-icon.spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
