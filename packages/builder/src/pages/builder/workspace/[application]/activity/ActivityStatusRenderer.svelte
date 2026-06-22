<script lang="ts">
  import { Badge, Icon } from "@budibase/bbui"

  export let row: {
    statusLabel: string
    statusTone: "completed" | "processing" | "needs-input" | "failed"
  }

  const iconByTone = {
    completed: "check-circle",
    processing: "circle",
    "needs-input": "warning",
    failed: "warning",
  } as const

  const badgeColors = {
    completed: {
      backgroundColor: "#4d6300",
      textColor: "#f5ffbe",
    },
    processing: {
      backgroundColor: "#0d5f80",
      textColor: "#d6f2ff",
    },
    "needs-input": {
      backgroundColor: "#7a5400",
      textColor: "#ffe7a1",
    },
    failed: {
      backgroundColor: "#6a1d1d",
      textColor: "#ffd8d8",
    },
  } as const
</script>

<Badge
  size="S"
  backgroundColor={badgeColors[row.statusTone].backgroundColor}
  textColor={badgeColors[row.statusTone].textColor}
>
  {row.statusLabel}
  <span class="status-icon">
    <Icon size="XS" name={iconByTone[row.statusTone]} color="currentColor" />
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
