<script lang="ts">
  import { Badge, Icon } from "@budibase/bbui"
  import { ACTIVITY_STATUS_LABELS, type ActivityStatus } from "./activityStatus"

  let {
    status,
    label,
  }: {
    status: ActivityStatus
    label?: string
  } = $props()

  const statusConfig: Record<
    ActivityStatus,
    {
      icon: string
      iconWeight: "regular" | "fill"
      color: string
    }
  > = {
    active: {
      icon: "spinner",
      iconWeight: "regular",
      color: "var(--spectrum-global-color-blue-500)",
    },
    needs_input: {
      icon: "warning",
      iconWeight: "fill",
      color: "var(--spectrum-global-color-yellow-500)",
    },
    waiting: {
      icon: "warning",
      iconWeight: "fill",
      color: "var(--spectrum-global-color-yellow-500)",
    },
    completed: {
      icon: "check-circle",
      iconWeight: "fill",
      color: "var(--spectrum-global-color-green-500)",
    },
    failed: {
      icon: "x-circle",
      iconWeight: "fill",
      color: "var(--spectrum-global-color-red-500)",
    },
  }
</script>

<div
  class="activity-status-badge"
  style:--activity-status-color={statusConfig[status].color}
>
  <Badge
    size="S"
    backgroundColor={`color-mix(in srgb, ${statusConfig[status].color} 18%, transparent)`}
    textColor="var(--activity-status-text-color)"
  >
    {label ?? ACTIVITY_STATUS_LABELS[status]}
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
  .activity-status-badge {
    --activity-status-text-color: var(--spectrum-alias-text-color);
  }

  :global(.spectrum--light) .activity-status-badge,
  :global(.spectrum--lightest) .activity-status-badge {
    --activity-status-text-color: var(--activity-status-color);
  }

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
