<script lang="ts">
  export let group: { name?: string } | undefined
</script>

<div data-testid="group-icon">{group?.name || "group"}</div>
