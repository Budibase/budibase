<script lang="ts">
  import ActivityOriginLabel from "./ActivityOriginLabel.svelte"

  let {
    row,
  }: {
    row: { triggeredByValue: string; triggeredByPrefix?: string }
  } = $props()
</script>

<ActivityOriginLabel
  value={row.triggeredByValue}
  prefix={row.triggeredByPrefix}
/>
