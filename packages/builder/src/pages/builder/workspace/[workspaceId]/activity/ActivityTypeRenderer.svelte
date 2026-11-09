<script lang="ts">
  import { Icon } from "@budibase/bbui"

  let {
    row,
  }: {
    row: {
      typeLabel: string
      typeIcon: string
      typeIconColor: string
    }
  } = $props()
</script>

<div class="activity-type">
  <Icon name={row.typeIcon} size="S" color={row.typeIconColor} weight="fill" />
  <span>{row.typeLabel}</span>
</div>

<style>
  .activity-type {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-s);
    min-width: 0;
  }

  .activity-type span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
