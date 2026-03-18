<script lang="ts">
  export let text = ""
  export let iconSize = "S"
</script>

<div data-testid="sync-badge" data-icon-size={iconSize}>
  {text || "Synced from your AD"}
</div>
