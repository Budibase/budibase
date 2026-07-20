<script lang="ts">
  import { Badge, Icon } from "@budibase/bbui"
  import type { AgentRequestStatus } from "@budibase/types"

  let {
    status,
  }: {
    status: AgentRequestStatus
  } = $props()

  const statusConfig: Record<
    AgentRequestStatus,
    {
      icon: string
      iconWeight: "regular" | "fill"
      color: string
      backgroundColor: string
      textColor: string
      label: string
    }
  > = {
    active: {
      icon: "spinner",
      iconWeight: "regular",
      color: "var(--spectrum-global-color-blue-500)",
      backgroundColor:
        "color-mix(in srgb, var(--spectrum-global-color-blue-500) 18%, transparent)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
      label: "Processing",
    },
    needs_input: {
      icon: "warning",
      iconWeight: "fill",
      color: "var(--spectrum-global-color-yellow-500)",
      backgroundColor:
        "color-mix(in srgb, var(--spectrum-global-color-yellow-500) 18%, transparent)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
      label: "Needs input",
    },
    completed: {
      icon: "check-circle",
      iconWeight: "fill",
      color: "var(--spectrum-global-color-green-500)",
      backgroundColor:
        "color-mix(in srgb, var(--spectrum-global-color-green-500) 18%, transparent)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
      label: "Completed",
    },
    failed: {
      icon: "x-circle",
      iconWeight: "fill",
      color: "var(--spectrum-global-color-red-500)",
      backgroundColor:
        "color-mix(in srgb, var(--spectrum-global-color-red-500) 18%, transparent)",
      textColor: "var(--spectrum-global-color-static-gray-50)",
      label: "Failed",
    },
  }
</script>

<div class="activity-status-badge">
  <Badge
    size="S"
    backgroundColor={statusConfig[status].backgroundColor}
    textColor={statusConfig[status].textColor}
  >
    {statusConfig[status].label}
    <span class="status-icon">
      <Icon
        size="XS"
        name={statusConfig[status].icon}
        weight={statusConfig[status].iconWeight}
        color={statusConfig[status].color}
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
