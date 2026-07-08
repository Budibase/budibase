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
    needs_input: "warning",
    completed: "check-circle",
    failed: "x-circle",
  }

  const iconWeightByStatus: Record<AgentRequestStatus, "regular" | "fill"> = {
    active: "regular",
    needs_input: "fill",
    completed: "fill",
    failed: "fill",
  }

  const colorByStatus: Record<AgentRequestStatus, string> = {
    active: "var(--spectrum-global-color-blue-500)",
    needs_input: "var(--spectrum-global-color-yellow-500)",
    completed: "var(--spectrum-global-color-green-500)",
    failed: "var(--spectrum-global-color-red-500)",
  }

  const badgeColorsByStatus: Record<
    AgentRequestStatus,
    { backgroundColor: string; textColor: string }
  > = {
    active: {
      backgroundColor: `color-mix(in srgb, ${colorByStatus.active} 18%, transparent)`,
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
    needs_input: {
      backgroundColor: `color-mix(in srgb, ${colorByStatus.needs_input} 18%, transparent)`,
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
    completed: {
      backgroundColor: `color-mix(in srgb, ${colorByStatus.completed} 18%, transparent)`,
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
    failed: {
      backgroundColor: `color-mix(in srgb, ${colorByStatus.failed} 18%, transparent)`,
      textColor: "var(--spectrum-global-color-static-gray-50)",
    },
  }

  const statusLabelByStatus: Record<AgentRequestStatus, string> = {
    active: "Processing",
    needs_input: "Needs input",
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
    <span class="status-icon">
      <Icon
        size="XS"
        name={iconByStatus[status]}
        weight={iconWeightByStatus[status]}
        color={colorByStatus[status]}
      />
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
</style>
