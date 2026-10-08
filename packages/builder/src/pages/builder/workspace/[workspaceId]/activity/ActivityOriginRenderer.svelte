<script lang="ts">
  import ActivityOriginLabel from "./ActivityOriginLabel.svelte"

  let {
    row,
  }: {
    row: { triggeredByLabel: string; triggeredByPrefix?: string }
  } = $props()
</script>

<ActivityOriginLabel
  label={row.triggeredByLabel}
  prefix={row.triggeredByPrefix}
/>
