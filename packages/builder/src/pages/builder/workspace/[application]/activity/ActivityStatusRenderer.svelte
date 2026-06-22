<script lang="ts">
  import { Badge, Icon } from "@budibase/bbui"

  export let row: {
    statusLabel: string
    statusTone: "completed"
  }

  const iconByTone = {
    completed: "check-circle",
  } as const

  const badgeColors = {
    completed: {
      backgroundColor: "#4d6300",
      textColor: "#f5ffbe",
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
