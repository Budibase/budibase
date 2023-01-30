<script>
  import { IconAvatar } from "@budibase/bbui"

  export let value
  export let row
</script>

<div class="align">
  <IconAvatar icon={row?.icon?.name || "Apps"} color={row?.icon?.color} />
  <div class="text">
    {value}
  </div>
</div>

<style>
  .align {
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: var(--spacing-m);
    max-width: var(--max-cell-width);
    flex: 1 1 auto;
    width: 0;
  }
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
